import { fileURLToPath } from "url"
import { dirname, join } from "path"
import fs from "fs-extra"

const { readJSON, writeJSON, writeFile } = fs

export const publicFolderPath = join(process.cwd(), "/public")

const dataFolderPath = join(dirname(fileURLToPath(import.meta.url)), "../data")

const productsJSONPath = join(dataFolderPath, "products.json")
const reviewsJSONPath = join(dataFolderPath, "reviews.json")

export const getProducts = () => readJSON(productsJSONPath)

const productsImagesPath = join(process.cwd(), "/public/productImgs")

export const saveProductImage = (fileName, imageAsBuffer) =>
  writeFile(join(productsImagesPath, fileName), imageAsBuffer)

export const writeProducts = (productsArray) =>
  writeJSON(productsJSONPath, productsArray)

export const getReviews = () => readJSON(reviewsJSONPath)
export const writeReviews = (reviewsArray) =>
  writeJSON(reviewsJSONPath, reviewsArray)
