export class BookmarkControl {
  constructor () {
    this.configP = {configP}
    this.rv = {returned_values}
    this.patientInfoExtract = {configP}['data']['patient_info_extract'] ?? []
    this.busqueda = {configP}['data']['busqueda'] ?? []
    this.check = 'n'
    this.rvBk = {returned_values}['bookmark']
    this.network = {configP}['network_mode'] === 'INN' ? 'IN' : 'OON'
    this.ageLimitCase = {configP}['data']['age_limit_case'] ?? []
    this.percentageCase = {configP}['data']['percentage_case'] ?? []
  }

  setBookmark (bk, value) {
    if (this.patientInfoExtract.includes(bk) && !(bk in this.rvBk)) {
      this.rvBk[bk] = value
    }
  }
}
