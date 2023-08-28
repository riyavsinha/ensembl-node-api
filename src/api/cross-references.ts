import { AxiosInstance } from "axios";
import Bottleneck from "bottleneck";

export type XrefExternalSymbolRequest = {
  /**
   * Species name/alias
   * @example human
   * @example homo_sapiens
   */
  species: string;
  /**
   * Symbol or display name of a gene
   * @example BRCA2
   */
  symbol: string;
  /**
   * Restrict the search to a database other than the default. Useful if you need to use a DB other than core
   */
  db_type?: string;
  /**
   * Filter by external database
   * @example HGNC
   */
  external_type?: string;
  /**
   * Filter by feature type
   * @example gene
   * @example transcript
   */
  object_type?: string;
};

export type XrefExternalSymbolResponse = {
  id: string;
  type: string;
}[];

export type XrefIdRequest = {
  /**
   * An Ensembl Stable ID
   * @example ENSG00000157764
   */
  id: string;
  /**
   * Set to find all genetic features linked to the stable ID, and fetch all external references for them. Specifying this on a gene will also return values from its transcripts and translations
   */
  all_levels?: boolean;
  /**
   * Restrict the search to a database other than the default. Useful if you need to use a DB other than core
   */
  db_type?: string;
  /**
   * Filter by external database
   * @example HGNC
   */
  external_type?: string;
  /**
   * Filter by feature type
   * @example gene
   * @example transcript
   */
  object_type?: string;
  /**
   * Species name/alias
   * @example human
   */
  species?: string;
};

export type XrefIdResponse = {
  info_text: string;
  version: string;
  dbname: string;
  display_id: string;
  info_type: string;
  synonyms: string[];
  db_display_name: string;
  primary_id: string;
  description: string;
}[];

export class Xref {
  constructor(private client: AxiosInstance, private limiter: Bottleneck) {}

  /**
   * Looks up an external symbol and returns all Ensembl objects linked to it. This can be a display name for a gene/transcript/translation, a synonym or an externally linked reference. If a gene's transcript is linked to the supplied symbol the service will return both gene and transcript (it supports transient links).
   *
   * @link https://rest.ensembl.org/documentation/info/xref_external
   */
  public async externalSymbol(
    req: XrefExternalSymbolRequest
  ): Promise<XrefExternalSymbolResponse> {
    const { data } = await this.limiter.schedule(() =>
      this.client.get<XrefExternalSymbolResponse>(
        `/xrefs/symbol/${req.species}/${req.symbol}`,
        {
          params: {
            db_type: req.db_type,
            external_type: req.external_type,
            object_type: req.object_type,
          },
        }
      )
    );
    return data;
  }

  /**
   * Perform lookups of Ensembl Identifiers and retrieve their external references in other databases
   *
   * @link https://rest.ensembl.org/documentation/info/xref_id
   */
  public async id(req: XrefIdRequest): Promise<XrefIdResponse> {
    const { data } = await this.limiter.schedule(() =>
      this.client.get<XrefIdResponse>(`/xrefs/id/${req.id}`, {
        params: {
          all_levels:
            req.all_levels === undefined ? undefined : +req.all_levels,
          db_type: req.db_type,
          external_type: req.external_type,
          object_type: req.object_type,
          species: req.species,
        },
      })
    );
    return data;
  }
}
