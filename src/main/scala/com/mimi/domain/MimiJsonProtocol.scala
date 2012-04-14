package com.mimi.domain

import cc.spray.json._

object MimiJsonProtocol extends DefaultJsonProtocol {
  implicit val colorFormat = jsonFormat5(MimiProduct.apply)
}
