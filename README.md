
# react-timepicker-clock

A react timepicker clock also compatible with next.js

## Demo
https://react-timepicker-clock.vercel.app
## Installation

```bash
  npm install react-timepicker-clock --save
```


## How to use?

```javascript
import TimePickerClock from 'react-timepicker-clock';

function App() {
  return (
      <TimePickerClock
            onSet={(hour,minute,noon,full_val)=>{
                // do something
            }}
            onCancel={()=>{
                // do something
            }}
       />
  )
}
```

## Props

| Prop             | Type   | Example   | Required    |
| ----------------- | ----------|---------|----------------------------------------------- |
| onSet | function | onSet={(hour, minute, noon, full_val)=> // do something} | true 
| onCancel | function | onCancel={()=> // do something} | true 


## Acknowledgements

 - [react-gradient-timepicker](https://github.com/rahuldhawani/react-gradient-timepicker)


## Contributing

Contributions are always welcome!