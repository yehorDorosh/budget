/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect, useMemo, useState, useCallback } from 'react'
import BaseCard from '../ui/BaseCard/BaseCard'
import CalculatorButton from './CalculatorButton'

import classes from './PriceCalculator.module.scss'

interface Props {
  onPressEqual: (result: number) => void
}

const PriceCalculator: FC<Props> = ({ onPressEqual }) => {
  const [result, setResult] = useState(0)
  const [input, setInput] = useState('0')

  const addableChars = useMemo(() => ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '+', '-', '*', '/'], [])
  const operators = useMemo(() => ['+', '-', '*', '/'], [])

  const buttonHandler = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      const target = e.currentTarget.id.replace('calc-', '')

      if (addableChars.includes(target)) {
        setInput((prev) => {
          if (prev === '0' && !operators.includes(target)) {
            return target
          }
          if (operators.includes(target) && prev.at(-1) === target) return prev
          return prev + target
        })
      }

      if (target === '.') {
        setInput((prev) => {
          if (prev.length === 0) {
            return '0.'
          }
          if (prev.at(-1) === '.') {
            return prev
          }
          return prev + '.'
        })
      }

      if (target === 'c') {
        setInput('0')
        setResult(0)
      }

      if (target === '<-') {
        setInput((prev) => {
          if (prev.length === 1) {
            setResult(0)
            return '0'
          }
          return prev.slice(0, -1)
        })
      }

      if (target === '+/-' && input.length > 0) {
        setInput((prev) => {
          if (operators.some((operator) => prev.includes(operator))) {
            const arg = prev.split(/[-+*/]/g)
            console.log(arg)
            return prev.replace(new RegExp(arg.at(-1) + '$'), `(-${arg.at(-1)})`)
          }
          return (+prev * -1).toString()
        })
      }
    },
    [addableChars, operators]
  )

  const resultHandler = useCallback(() => {
    // eslint-disable-next-line no-eval
    const result = eval(input)
    setResult(result)
    setInput(result.toString())
    onPressEqual(result)
  }, [onPressEqual])

  useEffect(() => {
    if (operators.some((operator) => input.includes(operator)) && !operators.includes(input.at(-1) + '')) {
      // eslint-disable-next-line no-eval
      const result = eval(input)
      setResult(result)
    }
  }, [input, operators])

  return (
    <BaseCard>
      <div className={classes.calc}>
        <p>Calculator</p>
        <div className="border px-3 py-2 mb-3 rounded text-end">{input}</div>
        <p>Preview</p>
        <div className="border px-3 py-2 mb-3 rounded text-end">{result}</div>
        <div className={classes.btns}>
          <CalculatorButton btnTxt="+/-" onClick={buttonHandler} className="btn-secondary" />
          <CalculatorButton btnTxt="c" onClick={buttonHandler} className="btn-secondary" />
          <CalculatorButton btnTxt="<-" onClick={buttonHandler} className="btn-secondary" />
          <CalculatorButton btnTxt="/" onClick={buttonHandler} className="btn-warning" />
          <CalculatorButton btnTxt="7" onClick={buttonHandler} className="btn-primary" />
          <CalculatorButton btnTxt="8" onClick={buttonHandler} className="btn-primary" />
          <CalculatorButton btnTxt="9" onClick={buttonHandler} className="btn-primary" />
          <CalculatorButton btnTxt="*" onClick={buttonHandler} className="btn-warning" />
          <CalculatorButton btnTxt="4" onClick={buttonHandler} className="btn-primary" />
          <CalculatorButton btnTxt="5" onClick={buttonHandler} className="btn-primary" />
          <CalculatorButton btnTxt="6" onClick={buttonHandler} className="btn-primary" />
          <CalculatorButton btnTxt="-" onClick={buttonHandler} className="btn-warning" />
          <CalculatorButton btnTxt="1" onClick={buttonHandler} className="btn-primary" />
          <CalculatorButton btnTxt="2" onClick={buttonHandler} className="btn-primary" />
          <CalculatorButton btnTxt="3" onClick={buttonHandler} className="btn-primary" />
          <CalculatorButton btnTxt="+" onClick={buttonHandler} className="btn-warning" />
          <CalculatorButton btnTxt="0" onClick={buttonHandler} className={`${classes.zero} btn-primary`} />
          <CalculatorButton btnTxt="." onClick={buttonHandler} className="btn-primary" />
          <CalculatorButton btnTxt="=" onClick={resultHandler} className="btn-danger" />
        </div>
      </div>
    </BaseCard>
  )
}

export default PriceCalculator
