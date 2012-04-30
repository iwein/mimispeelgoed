package com.mimi.domain

case class MimiProduct(title: String
                       , description: String
                       , paymentLink: Option[String] = None
                       , imageLink: String
                       , tags: Set[String] = Set.empty)

case class Template(name: String,  content: String)