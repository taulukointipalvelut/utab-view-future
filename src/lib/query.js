
export default function query (string) {
  const query_list = (string === '' || string === '?') ? [] : string.slice(1).split('&').map(v => v.split('=')).map(v => { return { key: v[0], value: v[1] } })
  const query = {}
  query_list.forEach(q => {
    query[q.key] = q.value
  })
  return query
}

