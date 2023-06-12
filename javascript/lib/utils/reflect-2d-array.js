function reflect2dArray(ar) {
  const result = []
  for (let i = 0; i < ar.length; i++) {
    for (let u = 0; u < ar[i].length; u++) {
      if (!result[u]) {
        result[u] = []
      }
      result[u][i] = ar[i][u]
    }
  }
  return result
}

module.exports = reflect2dArray
