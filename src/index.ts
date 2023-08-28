import axios, { AxiosInstance } from "axios";
export class EnsemblClient {
  private client: AxiosInstance;

  public constructor() {
    this.client = axios.create({
      baseURL: "http://rest.ensembl.org",
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
