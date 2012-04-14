package com.mimi

import cc.spray._
import utils.Logging

import cc.spray.json._
import com.mimi.domain.MimiJsonProtocol._

trait MimiService extends Directives with Repository with Logging {

  val staticResourceService = {
    path("") {
      getFromResourceDirectory("www", pathRewriter = _ => "index.html")
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
          listProducts.toJson.toString
        })
      }
    }
  }

  val postService = path("post") {
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