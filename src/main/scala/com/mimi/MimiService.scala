package com.mimi

import cc.spray._
import directives.SprayRoute1
import utils.Logging

import cc.spray.json._
import com.mimi.domain.MimiJsonProtocol._

trait MimiService extends Directives with Repository with Logging {

  def getTemplateFromMongo(name: String): Route = {
    get {
      ctx => {
        getTemplate(name).map {
          ctx.complete(_)
        }.getOrElse({
          ctx.reject()
        })
      }
    }
  }

  val staticResourceService = {
    path("") {
      getFromResourceDirectory("www", pathRewriter = _ => "index.html")
    } ~
    path("""templates/.*""".r) {
      (matched) => getTemplateFromMongo(matched.replace("templates/", ""))
    } ~
    path(""".*\.html""".r) {
      (matched) => getFromResource("www/" + matched)
    } ~
    pathPrefix("js|img|css".r) {
      (matched) => getFromResourceDirectory("www/" + matched)
    }
  }

  val productService = {
    path("products") {
      get {
        _.complete({
          log.info("Listing products")
          listProducts.toJson.toString()
        })
      }
    } ~
    path ("tags") {
      get {
        _.complete({
          log.info("Listing tags")
          Map("tags"->listTags).toJson.toString()
        })
      }
    }
  }

  val templateService = path("post") {
    post {
      (context: RequestContext) =>
        context.complete("POSTED:\n" +
              (context.request.content.map {
                (c) => new String(c.buffer)
              }).getOrElse("")
        )
    }
  }

}