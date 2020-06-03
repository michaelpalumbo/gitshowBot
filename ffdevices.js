var ffdevices = require('ffdevices')
 
ffdevices.getAll(function(error, devices) {
  if(!error) {
    console.log(devices)
  }
})