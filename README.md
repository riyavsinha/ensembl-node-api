# ensembl-node-api

Unofficial NodeJS API client for Ensembl's REST API

It is extremely limited in scope currently. Help is welcome to incrementally expand it. See [Supported Endpoints](#supported-endpoints) for a list of endpoints that are currently supported.

This client supports automatic rate-limiting per the [Ensembl REST API documentation](https://github.com/Ensembl/ensembl-rest/wiki/Rate-Limits).

## Usage

### Installation

```
npm install ensembl-node-api
```

### Example

```
import { EnsemblClient } from 'ensembl-node-api';

const client = new EnsemblClient();
console.log(await client.xref.externalSymbol({
  species: 'human',
  symbol: 'BRCA2'
}))
```

## Supported Endpoints

- [ ] Archive
- [ ] Comparative Genomics
- [x] Cross References
  - [x] ID
  - [x] Name
  - [x] Symbol
- [ ] Information
- [x] Linkage Disequilibrium
  - [x] For variant
  - [x] For region
  - [x] Pairwise
- [ ] Lookup
  - [x] Id
  - [ ] Ids
  - [ ] Symbol
  - [ ] Symbols
- [ ] Mapping
- [ ] Ontologies and Taxonomy
- [ ] Phenotype Annotations
- [ ] Overlap
- [ ] Regulation
- [ ] Sequence
- [ ] Transcript Haplotypes
- [ ] VEP
- [ ] Variation
- [ ] Variation GA4GH
