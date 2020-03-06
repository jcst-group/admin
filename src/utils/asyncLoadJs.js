export function loadAMapJS () {
  let key = '0a08e7d37ce4505582fb287cc1213bb3';
  return new Promise((resolve, reject) => {
    console.log('https://webapi.amap.com/maps?v=1.4.14&key='+key)
    asyncLoadJs('https://webapi.amap.com/maps?v=1.4.14&key='+key)
      .then(() => {
        //return asyncLoadJs('https://webapi.amap.com/ui/1.0/main.js')
      })
      .then(() => {
        resolve()
      })
      .catch(err => {
        reject(err)
      })
  })
}

function asyncLoadJs (url) {
  return new Promise((resolve, reject) => {
    let hasLoaded = $('script[src="'+url+'"]').length > 0
    //let script=document.createElement('script')
    if (hasLoaded) {
      resolve()
      return
    }

    let script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = url
    document.body.appendChild(script)
    script.onload = () => {
      resolve()
    }
    script.onerror = () => {
      reject()
    }
  })
}
