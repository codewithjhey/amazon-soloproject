import express from "express"
import productsRouter from "./api/products/index.js"
import listEndpoints from "express-list-endpoints"
import filesRouter from "./files/index.js"
import { publicFolderPath } from "./lib/fs-tools.js"
import cors from "cors"
import {
  genericErrorHandler,
  notFoundHandler,
  badRequestHandler,
  unauthorizedHandler
} from "./errorHandlers.js"

const server = express()

const port = 3002

server.use(cors())
server.use(express.json())
server.use(express.static(publicFolderPath))

server.use("/products", productsRouter)
server.use("/product", filesRouter)

server.use(badRequestHandler)
server.use(unauthorizedHandler)
server.use(notFoundHandler)
server.use(genericErrorHandler)

server.listen(port, () => {
  console.table(listEndpoints(server))
  console.log("server is running on port:", port)
})
