const express = require("express");
const prisma = require("../prisma");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const books = await prisma.Libro.findMany();
    return res.json(books);
  } catch (error) {
    console.log(error);
  }
});

router.get("/with-sales", async (req, res) => {
  try {
    const books = await prisma.Libro.findMany({
      select: {
        ISBN: true,
        Titulo: true,
        Ventas: {
          select: {
            Cantidad: true,
          },
        },
      },
    });
    const totalList = books
      .map((book) => {
        book.Ventas = book.Ventas.reduce((acc, curr) => acc + curr.Cantidad, 0);
        return book;
      })
      .sort((x, y) => y.Ventas - x.Ventas);

    return res.json(totalList[0]);
  } catch (error) {
    console.log(error);
  }
});

router.get("/:isbn", async (req, res) => {
  try {
    const isbn = req.params.isbn;
    const libro = await prisma.Libro.findUnique({
      where: {
        ISBN: isbn,
      },
    });
    return res.json(libro);
  } catch (error) {
    console.log(error);
  }
});

router.get("/author/:author", async (req, res) => {
  try {
    const author = req.params.author;
    const libro = await prisma.Libro.findMany({
      where: {
        Autor: author,
      },
    });
    return res.json(libro);
  } catch (error) {
    console.log(error);
  }
});

router.get("/price/:price", async (req, res) => {
  try {
    const price = Number(req.params.price);
    const bookPrice = await prisma.Libro.findMany({
      where: {
        Precio: {
          gt: price,
        },
      },
    });
    return res.json(bookPrice);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
