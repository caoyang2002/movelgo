import React, { useState } from 'react'

// 使用一个函数包裹组件代码
function InputWithButton() {
  const [inputValue, setInputValue] = useState<string>('')

  const handleButtonClick = () => {
    console.log('Input value:', inputValue)
  }

  return (
    <div>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Enter text..."
        style={{ marginRight: '10px' }}
      />
      <button onClick={handleButtonClick}>Print to Console</button>
    </div>
  )
}

export default InputWithButton
