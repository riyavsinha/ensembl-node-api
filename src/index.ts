import axios, { AxiosInstance } from "axios";
import Bottleneck from "bottleneck";
import { Xref } from "./api/cross-references.js";
import {
  LinkageDisequilibrium,
} from "./api/linkage-disequilibrium.js";
import { Lookup } from "./api/lookup.js";

export class EnsemblClient {
  private client: AxiosInstance;
  private limiter: Bottleneck;

  public xref: Xref;
  public ld: LinkageDisequilibrium;
  public lookup: Lookup;

  public constructor(reqsPerSec = 15) {
    this.client = axios.create({
      baseURL: "http://rest.ensembl.org",
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.limiter = new Bottleneck({
      maxConcurrent: reqsPerSec,
      minTime: 1000 / reqsPerSec,
    });

    this.xref = new Xref(this.client, this.limiter);
    this.ld = new LinkageDisequilibrium(this.client, this.limiter);
    this.lookup = new Lookup(this.client, this.limiter);
  }
}
