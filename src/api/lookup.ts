import { AxiosInstance } from "axios";
import Bottleneck from "bottleneck";
import { booleanToInt } from "../utils/utils.js";

export type LookupFormat = "full" | "condensed";

export type LookupIdRequest = {
  /**
   * An Ensembl stable ID
   * @example ENSG00000157764
   */
  id: string;
  /**
   * Restrict the search to a database other than the default. Useful if you need to use a DB other than core
   */
  db_type?: string;
  /**
   * Expands the search to include any connected features. e.g. If the object is a gene, its transcripts, translations and exons will be returned as well.
   */
  expand?: boolean;
  /**
   * Specify the formats to emit from this endpoint
   */
  format?: LookupFormat;
  /**
   * Include MANE features. Only available if the expand option is used.
   */
  mane?: boolean;
  /**
   * Include phenotypes. Only available for gene objects.
   */
  phenotypes?: boolean;
  /**
   * 	Species name/alias
   */
  species?: string;
  /**
   * Include 5' and 3' UTR features. Only available if the expand option is used.
   */
  utr?: boolean;
};

export type LookupIdResponse = {
  end: number;
  species: string;
  id: string;
  version: number;
  assembly_name: string;
  logic_name: string;
  biotype: string;
  display_name: string;
  db_type: string;
  strand: number;
  seq_region_name: number;
  start: number;
  canonical_transcript: string;
  object_type: string;
  description: string;
  source: string;
  Transcript?: Transcript[];
};

export type Transcript = {
  logic_name: string;
  display_name: string;
  source: string;
  is_canonical: number;
  start: number;
  biotype: string;
  Parent: string;
  strand: number;
  id: string;
  seq_region_name: string;
  end: number;
  db_type: string;
  assembly_name: string;
  version: number;
  species: string;
  object_type: "Transcript";
  Exon: Exon[];
  Translation: Translation;
};

export type Exon = {
  seq_region_name: string;
  end: number;
  start: number;
  strand: number;
  object_type: string;
  assembly_name: string;
  db_type: string;
  species: string;
  id: string;
  version: number;
};

export type Translation = {
  db_type: string;
  version: number;
  species: string;
  id: string;
  start: number;
  length: number;
  end: number;
  Parent: string;
  object_type: string;
};

export class Lookup {
  constructor(private client: AxiosInstance, private limiter: Bottleneck) {}

  /**
   * Find the species and database for a single identifier e.g. gene, transcript, protein
   *
   * https://rest.ensembl.org/documentation/info/lookup
   */
  public async id(req: LookupIdRequest): Promise<LookupIdResponse> {
    const { data } = await this.limiter.schedule(() =>
      this.client.get<LookupIdResponse>(`/lookup/id/${req.id}`, {
        params: {
          db_type: req.db_type,
          expand: booleanToInt(req.expand),
          format: req.format,
          mane: booleanToInt(req.mane),
          phenotypes: booleanToInt(req.phenotypes),
          species: req.species,
          utr: booleanToInt(req.utr),
        },
      })
    );
    return data;
  }
}
