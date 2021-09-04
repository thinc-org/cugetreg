/**
 * 
 * @param myArray Example [
    { group: 'one', color: 'red' },
    { group: 'two', color: 'blue' },
    { group: 'one', color: 'green' },
    { group: 'one', color: 'black' },
  ]
 * @param group 
 * @returns [{group: "one", value: [{corlor: "red"}, {color: "green"}, {color: "black"}]}, {group: "two", value: [{color: "blue"}]}"
 */
export function groupBy(myArray: Record<string, any>[], group: string, defaultValue = 'default') {
  const obj = {} as Record<any, any[]>
  myArray.forEach((data) => {
    const groupName = data![group] || defaultValue
    if (!obj[groupName]) {
      obj[groupName] = []
    }
    const { [group]: _, ...dataWithoutGroup } = data
    obj[groupName].push(dataWithoutGroup)
  })

  const groups = Object.keys(obj).map(function (key) {
    return { group: key, value: obj[key] }
  })

  return groups
}
