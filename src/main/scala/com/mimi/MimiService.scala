package com.mimi

import cc.spray._

trait MimiService extends Directives {

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