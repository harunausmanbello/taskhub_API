import { Router } from "express";
import inputSchema from "../validators/signup";
import SignUpInterface from "../dtos/signup";

const router = Router();

router.post("/", (req, res) => {
  const inputBody = req.body as SignUpInterface;
  inputSchema
    .validateAsync(inputBody)
    .then(async (validateData) => {
      res.status(201).send(validateData);
    })
    .catch(async (error) => {
      res
        .status(404)
        .send(error.details ? error.details[0].message : error.message);
    });
});

export default router;
