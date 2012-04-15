package com.mimi

import domain.MimiProduct
import util.parsing.json.JSON
import util.matching.Regex
import cc.spray.utils.Logging
import com.mongodb.casbah.Imports._
import com.mongodb.casbah.commons.conversions.scala.RegisterJodaTimeConversionHelpers
import com.mongodb.casbah.{MongoCollection, MongoConnection, MongoDB, MongoURI}

import com.novus.salat._
import com.novus.salat.global._

/**
 * This is the central repository
 *
 * @author iwein
 */

trait Repository {
  def listProducts : List[MimiProduct] = {
    MongoRepository.products.doWithCollection(c => {
      c.find().map(grater[MimiProduct].asObject(_)).toList
    })
  }

  def listTags : Set[String] = {
    listProducts.foldLeft(Set.empty[String])(_ ++ _.tags)
  }

}

object MongoRepository extends Logging with ConfigurationParser {

  RegisterJodaTimeConversionHelpers()

  val products = new AutoClosingMongoCollection[MimiProduct](buildMongoDb, "products")

  def caseClassToMap(cc: AnyRef) =
    (Map[String, Any]() /: cc.getClass.getDeclaredFields) {
      (a, f) =>
        f.setAccessible(true)
        a + (f.getName -> f.get(cc))
    }

  lazy val (mongoUri, username, password)  = {
    val vcapServices: String = System.getenv("VCAP_SERVICES")
    val mongoLabUri: String = System.getenv("MONGOLAB_URI")

    if (vcapServices == null && mongoLabUri == null) {
      log.info("Neither VCAP_SERVICES nor MONGOLAB_URI found, assuming we're running local")
      (MongoURI("mongodb://localhost:27017/test"), "", "")
    }
    else if (mongoLabUri != null) {
      log.info("Found mongoUri %s. Assuming we're talking to MongoLabs".format(mongoLabUri))
      val (fixedMongoUri, user, pass) = parseMongoUri(mongoLabUri)
      (fixedMongoUri, user, pass)
    }
    else {
      log.info("Found VCAP_SERVICES, assuming we run on CloudFoundry")
      val serviceInfo = parseVcapServices(System.getenv("VCAP_SERVICES"))
      (MongoURI("mongodb://" + serviceInfo.get("host").get +
              ":" + serviceInfo.get("port").get.asInstanceOf[Double].round.toString + "/" + serviceInfo.get("db").get),
              serviceInfo.get("username").get.toString, serviceInfo.get("password").get.toString)
    }
  }

  def buildMongoDb : MongoDB = {
    log.info("Connecting to mongo on uri: %s".format(mongoUri))
    val connection: MongoDB = MongoConnection(mongoUri)(mongoUri.database)
    if (username.length() > 0){
      connection.authenticate(username, password)
    }
    connection
  }
}

class AutoClosingMongoCollection[Type <: CaseClass](mongo: MongoDB, collectionName: String) {
  def insert(obj: Type) (implicit ctx: Context, m: Manifest[Type]) {
    doWithCollection(c => {
      c.insert(grater[Type].asDBObject(obj))
    })
  }

  def drop() = doWithCollection[Unit]((c: MongoCollection) => c.drop())

  val collection = mongo(collectionName)

  def doWithCollection[T](f: (MongoCollection) => T): T = {
    try {
      mongo.requestStart()
      f(collection)
    } finally {
      mongo.requestDone()
    }
  }
}

trait ConfigurationParser extends Logging {
  def parseVcapServices(vcap_services: String): Map[String, Any] = {
      //Map(mongodb-1.8 -> List(Map(name -> mongodb-props, tags -> List(mongodb, mongodb-1.8, nosql), label -> mongodb-1.8, credentials -> Map(name -> 122f8437-fbd3-424a-8afc-d51a50a162ca, hostname -> 127.0.0.1, username -> 4a86ced9-7264-4ad2-b709-a0f9dad81551, host -> 127.0.0.1, db -> db, port -> 25002.0, password -> b7f0ed44-d1df-4a9b-8dc7-08bc15919987), plan -> free)))

    JSON.parseFull(vcap_services).getOrElse(Map.empty).asInstanceOf[Map[String, Any]]
    .get("mongodb-1.8").get.asInstanceOf[List[Any]]
      .head.asInstanceOf[Map[String, Any]]
      .get("credentials").get.asInstanceOf[Map[String, Any]]
  }

  def parseMongoUri(mongoUri: String): (MongoURI, String, String) = {
    val uri = new Regex("""mongodb://([^:]*):([^@]*)@(.*)""")
    val uri(user, pass, tail) = mongoUri
    val fixedMongoUri = MongoURI("mongodb://" + tail)
    log.debug("Fixed mongouri: %s, user: %s, password not empty: %s".format(fixedMongoUri, user, pass.nonEmpty))
    (fixedMongoUri, user, pass)
  }

}