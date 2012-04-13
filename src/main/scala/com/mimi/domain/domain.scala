package com.mimi.domain

case class MimiProduct(title: String
                       , description: String
                       , paymentLink: String
                       , imageLink: String
                       , tags: List[String] = List.empty)