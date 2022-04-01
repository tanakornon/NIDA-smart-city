import axios from 'axios';
import { mongoEndpoint } from '../configs/prod';

export async function post(path: string, data: any): Promise<void> {
  console.log(data);
  await axios
    .post(`${mongoEndpoint}/${path}`, data)
    .catch((err) => console.error(err.message));
}
