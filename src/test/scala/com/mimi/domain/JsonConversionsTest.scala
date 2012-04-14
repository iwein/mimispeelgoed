package com.mimi.domain

import org.specs2.mutable.Specification
import com.mimi.TestData

import cc.spray.json._
import com.mimi.domain.MimiJsonProtocol._

class JsonConversionsTest extends Specification with TestData {

  "Using the MimiJsonProtocol" should {
    "enable the conversion of a list of products to Json " in {
      List(mimiProduct).toJson.toString() must contain (  """tags":["tag","tog","tug"]}""")
    }
  }

}