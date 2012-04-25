package com.mimi

import domain.MimiProduct
import org.specs2.mutable._
import cc.spray._
import test._
import http._
import HttpMethods._
import StatusCodes._
import org.slf4j.LoggerFactory

trait StubRepository extends Repository {
  def listProducts = List(MimiProduct("theTitle", "theDescription", "thePaymentLink", "theImageLink", Set("tag")))

  def listTags = Set("tag")

  def getTemplate(name: String) = Some("prettyTemplate")
}

class ServiceSpec extends Specification with SprayTest with MimiService with StubRepository {
  LoggerFactory.getLogger(getClass)

  "The MimiService" should {
    "return the index for GET requests to the root path" in {
      testService(HttpRequest(GET, "/")) {
        staticResourceService
      }.response.content.as[String].right.getOrElse("Failed") must contain ("MimiSpeelgoed")
    }
    "leave GET requests to random paths unhandled" in {
      testService(HttpRequest(GET, "/kermit")) {
        staticResourceService
      }.handled must beFalse
    }
    "return a MethodNotAllowed error for POST requests to the root path" in {
      testService(HttpRequest(POST, "/")) {
        staticResourceService
      }.response mustEqual HttpResponse(MethodNotAllowed, "HTTP method not allowed, supported methods: GET")
    }
    "return a list of products on /products" in {
      val result = testService(HttpRequest(GET, "/products")) {
        productService
      }
      result.handled must beTrue
    }
    "get a template from the Repository" in {
      val result = testService(HttpRequest(GET, "/templates/whatever.html")) {
        staticResourceService
      }
      result.handled must beTrue
      result.response mustEqual HttpResponse(OK, "prettyTemplate")
    }
  }
  
}