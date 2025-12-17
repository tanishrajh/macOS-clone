import React, { useState } from 'react';
import clsx from 'clsx';

export const Calculator: React.FC = () => {
    const [display, setDisplay] = useState('0');
    const [prevValue, setPrevValue] = useState<number | null>(null);
    const [operator, setOperator] = useState<string | null>(null);
    const [waitingForOperand, setWaitingForOperand] = useState(false);

    // InitialState for AC/C
    const clearAll = () => {
        setDisplay('0');
        setPrevValue(null);
        setOperator(null);
        setWaitingForOperand(false);
    };

    const inputDigit = (digit: string) => {
        if (waitingForOperand) {
            setDisplay(digit);
            setWaitingForOperand(false);
        } else {
            setDisplay(display === '0' ? digit : display + digit);
        }
    };

    const inputDot = () => {
        if (waitingForOperand) {
            setDisplay('0.');
            setWaitingForOperand(false);
        } else if (!display.includes('.')) {
            setDisplay(display + '.');
        }
    };

    const performOperation = (nextOperator: string) => {
        const inputValue = parseFloat(display);

        if (prevValue === null) {
            setPrevValue(inputValue);
        } else if (operator) {
            const currentValue = prevValue || 0;
            const newValue = calculate(currentValue, inputValue, operator);
            setPrevValue(newValue);
            setDisplay(String(newValue));
        }

        setWaitingForOperand(true);
        setOperator(nextOperator);
    };

    const calculate = (a: number, b: number, op: string) => {
        switch (op) {
            case '/': return a / b;
            case '*': return a * b;
            case '-': return a - b;
            case '+': return a + b;
            case '=': return b;
            default: return b;
        }
    };

    const toggleSign = () => {
        setDisplay(String(parseFloat(display) * -1));
    };

    const percent = () => {
        setDisplay(String(parseFloat(display) / 100));
    };

    const Btn = ({ label, orange = false, gray = false, wide = false, onClick, active = false }: any) => (
        <button
            className={clsx(
                "h-12 text-xl font-medium rounded-full transition-all active:brightness-110 flex items-center justify-center",
                orange ? (active ? "bg-[#CC7A00] text-white" : "bg-[#FF9F0A] text-white") :
                    gray ? "bg-[#A5A5A5] text-black" : "bg-[#333333] text-white",
                wide ? "col-span-2 pl-6 justify-start" : ""
            )}
            onClick={onClick}
        >
            {label}
        </button>
    );

    return (
        <div className="w-full h-full bg-black text-white p-4 flex flex-col">
            <div className="flex-1 flex items-end justify-end mb-4 px-2">
                <span className="text-5xl font-light truncate">{display}</span>
            </div>

            <div className="grid grid-cols-4 gap-3">
                <Btn label={display === '0' ? 'AC' : 'C'} gray onClick={clearAll} />
                <Btn label="+/-" gray onClick={toggleSign} />
                <Btn label="%" gray onClick={percent} />
                <Btn label="÷" orange active={operator === '/'} onClick={() => performOperation('/')} />

                <Btn label="7" onClick={() => inputDigit('7')} />
                <Btn label="8" onClick={() => inputDigit('8')} />
                <Btn label="9" onClick={() => inputDigit('9')} />
                <Btn label="×" orange active={operator === '*'} onClick={() => performOperation('*')} />

                <Btn label="4" onClick={() => inputDigit('4')} />
                <Btn label="5" onClick={() => inputDigit('5')} />
                <Btn label="6" onClick={() => inputDigit('6')} />
                <Btn label="-" orange active={operator === '-'} onClick={() => performOperation('-')} />

                <Btn label="1" onClick={() => inputDigit('1')} />
                <Btn label="2" onClick={() => inputDigit('2')} />
                <Btn label="3" onClick={() => inputDigit('3')} />
                <Btn label="+" orange active={operator === '+'} onClick={() => performOperation('+')} />

                <Btn label="0" wide onClick={() => inputDigit('0')} />
                <Btn label="." onClick={inputDot} />
                <Btn label="=" orange onClick={() => performOperation('=')} />
            </div>
        </div>
    );
};
