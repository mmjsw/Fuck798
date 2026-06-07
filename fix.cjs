const fs = require('fs');
const path = 'src/components/DeviceList.vue';
let c = fs.readFileSync(path, 'utf8');
c = c.replace(/alert\('设备可能已经开启或者开启失[^']*\)/g, "alert('设备可能已经开启或者开启失败')");
c = c.replace(/alert\('设备开启失[^']*\)/g, "alert('设备开启失败')");
c = c.replace(/alert\('设备可能已经关闭或者关闭失[^']*\)/g, "alert('设备可能已经关闭或者关闭失败')");
fs.writeFileSync(path, c, 'utf8');
console.log('done');