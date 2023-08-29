import { AxiosInstance } from "axios";
import Bottleneck from "bottleneck";
import { booleanToInt } from "../utils/utils.js";

export enum LdPopulation {
  /** African Caribbean in Barbados */
  ACB = "1000GENOMES:phase_3:ACB",
  /** African Ancestry in Southwest US */
  ASW = "1000GENOMES:phase_3:ASW",
  /** Bengali in Bangladesh */
  BEB = "1000GENOMES:phase_3:BEB",
  /** Chinese Dai in Xishuangbanna, China */
  CDX = "1000GENOMES:phase_3:CDX",
  /** Utah residents with Northern and Western European ancestry */
  CEU = "1000GENOMES:phase_3:CEU",
  /** Han Chinese in Bejing, China */
  CHB = "1000GENOMES:phase_3:CHB",
  /** Southern Han Chinese, China */
  CHS = "1000GENOMES:phase_3:CHS",
  /** Colombian in Medellin, Colombia */
  CLM = "1000GENOMES:phase_3:CLM",
  /** Esan in Nigeria */
  ESN = "1000GENOMES:phase_3:ESN",
  /** Finnish in Finland */
  FIN = "1000GENOMES:phase_3:FIN",
  /** British in England and Scotland */
  GBR = "1000GENOMES:phase_3:GBR",
  /** Gujarati Indian in Houston, TX */
  GIH = "1000GENOMES:phase_3:GIH",
  /** Gambian in Western Division, The Gambia */
  GWD = "1000GENOMES:phase_3:GWD",
  /** Iberian populations in Spain */
  IBS = "1000GENOMES:phase_3:IBS",
  /** Indian Telugu in the UK */
  ITU = "1000GENOMES:phase_3:ITU",
  /** Japanese in Tokyo, Japan */
  JPT = "1000GENOMES:phase_3:JPT",
  /** Kinh in Ho Chi Minh City, Vietnam */
  KHV = "1000GENOMES:phase_3:KHV",
  /** Luhya in Webuye, Kenya */
  LWK = "1000GENOMES:phase_3:LWK",
  /** Mende in Sierra Leone */
  MSL = "1000GENOMES:phase_3:MSL",
  /** Mexican Ancestry in Los Angeles, California */
  MXL = "1000GENOMES:phase_3:MXL",
  /** Peruvian in Lima, Peru */
  PEL = "1000GENOMES:phase_3:PEL",
  /** Punjabi in Lahore, Pakistan */
  PJL = "1000GENOMES:phase_3:PJL",
  /** Puerto Rican in Puerto Rico */
  PUR = "1000GENOMES:phase_3:PUR",
  /** Sri Lankan Tamil in the UK */
  STU = "1000GENOMES:phase_3:STU",
  /** Toscani in Italy */
  TSI = "1000GENOMES:phase_3:TSI",
  /** Yoruba in Ibadan, Nigeria */
  YRI = "1000GENOMES:phase_3:YRI",
  /** Population from the Gambian Genome Variation Project. Gambian in Western Division, The Gambia - Fula */
  GGVP_GWF = "GGVP:GWF",
  /** Population from the Gambian Genome Variation Project. Gambian in Western Division, The Gambia - Mandinka. */
  GGVP_GWD = "GGVP:GWD",
  /** Population from the Gambian Genome Variation Project. Gambian in Western Division, The Gambia - Wolof. */
  GGVP_GWW = "GGVP:GWW",
  /** Population from the Gambian Genome Variation Project. Gambian in Western Division, The Gambia - Jola. */
  GGVP_GWJ = "GGVP:GWJ",
}

export type LdForVariantRequest = {
  /**
   * Variant id
   */
  id: string;
  /**
   * Population for which to compute LD. Use the `LdPopulation` enum for valid values.
   */
  population_name: LdPopulation;
  /**
   * Species name/alias
   */
  species: string;
  /**
   * Whether to add variation attributes for the variation which is used to compute LD data with the input variation: chr, start, end, strand, consequence_type, clinical_significance
   *
   * @default false
   */
  attribs?: boolean;
  /**
   * Measure of LD. If D' is provided only return pairs of variants whose D' value is equal to or greater than the value provided.
   */
  d_prime?: number;
  /**
   * Measure of LD. If r-squared is provided only return pairs of variants whose r-squared value is equal to or greater than the value provided.
   */
  r2?: number;
  /**
   * Window size in kb. The maximum allowed value for the window size is 500 kb. LD is computed for the given variant and all variants that are located within the specified window.
   * 
   * @default 500
   */
  window_size?: number;
};

export type LdForVariantResponse = {
  population_name: LdPopulation;
  d_prime: string;
  variation2: string;
  variation1: string;
  r2: string;
}[];

export class LinkageDisequilibrium {
  constructor(private client: AxiosInstance, private limiter: Bottleneck) {}

  /**
   * Computes and returns LD values between the given variant and all other variants in a window centered around the given variant.
   * 
   * @link https://rest.ensembl.org/documentation/info/ld_id_get
   */
  public async forVariant(
    req: LdForVariantRequest
  ): Promise<LdForVariantResponse> {
    const { data } = await this.limiter.schedule(() =>
      this.client.get<LdForVariantResponse>(
        `/ld/${req.species}/${req.id}/${req.population_name}`,
        {
          params: {
            attribs: booleanToInt(req.attribs),
            d_prime: req.d_prime,
            r2: req.r2,
            window_size: req.window_size,
          },
        }
      )
    );

    return data;
  }
}
