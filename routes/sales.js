const express = require("express");
const prisma = require("../prisma");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const sales = await prisma.Venta.findMany();
    return res.json(sales);
  } catch (error) {
    console.log(error);
  }
});

router.get("/top", async (req, res) => {
  try {
    const sales = await prisma.Venta.findMany({
      select: {
        ISBN: true,
        Cantidad: true
      }
    });
    const bookPrices = await prisma.Libro.findMany({
      select: {
        ISBN: true,
        Titulo: true,
        Precio: true
      }
    });
    const result = sales.map((sale) => {
      const book = bookPrices.find((book) => book.ISBN === sale.ISBN)
      if(!book) return null
      const totalRevenue= sale.Cantidad * book.Precio
      return {
        ISBN: sale.ISBN,
        Titulo: book.Titulo,
        Ganancia: totalRevenue
      }
    })
    const filteredResult = result
      .filter((item) => item !== null)
      .sort((x, y) => y.Ganancia - x.Ganancia);
    return res.json(filteredResult[0]);
  } catch (error) {
    console.log(error);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const venta = await prisma.Venta.findUnique({
      where: {
        ID_Venta: id,
      },
    });
    return res.json(venta);
  } catch (error) {
    console.log(error);
  }
});

router.get("/book/:isbn", async (req, res) => {
  try {
    const isbn = req.params.isbn;
    const ventas = await prisma.Venta.findMany({
      where: {
        ISBN: isbn,
      },
    });
    return res.json(ventas);
  } catch (error) {
    console.log(error);
  }
});

router.get("/date/:date", async (req, res) => {
  try {
    const date = req.params.date;
    const inputDate = new Date(date);
    const ventasPorDia = await prisma.Venta.findMany({
      where: {
        Fecha_Venta: inputDate,
      },
    });
    return res.json(ventasPorDia);
  } catch (error) {
    console.log(error);
  }
});



module.exports = router;
