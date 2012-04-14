package com.mimi

import domain.MimiProduct
import domain.MimiProduct._

trait TestData {
  val mimiProduct: MimiProduct = MimiProduct(
    "Title", "description", "https://payment", "http://image", List("tag", "tog", "tug")
  )
}