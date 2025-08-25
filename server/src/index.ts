import express, { Request, Response, Router } from 'express';
import type { RequestHandler } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import https from 'https';
import fs from 'fs';
import path from 'path';

dotenv.config();

const app = express();
const router = Router();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

interface OpenFoodFactsResponse {
  status: number;
  product?: any;
}

interface ProductParams {
  barcode: string;
}

const getProduct: RequestHandler<ProductParams> = async (req, res, next): Promise<void> => {
  try {
    const { barcode } = req.params;
    const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
    const data = (await response.json()) as OpenFoodFactsResponse;

    console.log(data);

    if (!data || data.status === 0) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    res.json(data);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Failed to fetch product data' });
  }
};

const healthCheck: RequestHandler = (_req, res): void => {
  res.json({ status: 'ok' });
};

router.get('/api/product/:barcode', getProduct);
router.get('/api/health', healthCheck);

app.use(router);

// HTTPS configuration
const httpsOptions = {
  key: fs.readFileSync(path.join(__dirname, '../ssl/key.pem')),
  cert: fs.readFileSync(path.join(__dirname, '../ssl/cert.pem')),
};

// Create HTTPS server
const server = https.createServer(httpsOptions, app);

server.listen(port, () => {
  console.log(`🔒 HTTPS Server running at https://localhost:${port}`);
  console.log(`📱 Mobile access: https://YOUR_IP:${port}`);
});
