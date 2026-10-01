document.addEventListener('DOMContentLoaded', () => {
    const display = document.getElementById("display");
    const info = document.getElementById("info");

    let firstNum = null;
    let currentOp = null;
    let errorLog = []; // Sistema de registro de errores

    // Gestión de errores robusta y logging
    const logError = (msg) => {
        const timestamp = new Date().toISOString();
        errorLog.push(`[${timestamp}] ${msg}`);
        info.innerHTML = msg;
        info.style.color = "red";
    };

    const setInfo = (msg) => {
        info.innerHTML = msg;
        info.style.color = "#2980b9";
    };

    // Efecto visual al pulsar botones
    document.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.target.classList.add('active-btn');
            setTimeout(() => e.target.classList.remove('active-btn'), 150);
        });
    });

    // Validaciones
    const validate = (requireCSV = false) => {
        const val = display.value.trim();
        if (val === "") {
            logError("Error: El campo está vacío. Introduce un valor.");
            return false;
        }
        if (/[a-zA-Z]/.test(val)) {
            logError("Error: Se ha introducido texto en lugar de números.");
            return false;
        }
        if (requireCSV) {
            if (val.endsWith(',') || val.includes(',,')) {
                logError("Error: Formato CSV incompleto o inválido.");
                return false;
            }
        }
        return true;
    };

    // Operaciones Unarias
    document.getElementById('sqrt').addEventListener('click', () => {
        if (!validate()) return;
        let num = Number(display.value);
        if (num < 0) {
            logError("Error: Raíz cuadrada de un número negativo.");
            return;
        }
        let res = Math.sqrt(num);
        display.value = res;
        setInfo(`Raíz cuadrada calculada. El número era positivo. Resultado: ${res}`);
    });

    document.getElementById('square').addEventListener('click', () => {
        if (!validate()) return;
        let res = Math.pow(Number(display.value), 2);
        display.value = res;
        setInfo(`Operación completada: Elevado al cuadrado. El resultado es ${res}`);
    });

    document.getElementById('modulo').addEventListener('click', () => {
        if (!validate()) return;
        display.value = Math.abs(Number(display.value));
        setInfo(`Valor absoluto aplicado.`);
    });

    document.getElementById('factorial').addEventListener('click', () => {
        if (!validate()) return;
        let num = Number(display.value);
        if (num < 0 || !Number.isInteger(num)) {
            logError("Error: El factorial requiere enteros positivos.");
            return;
        }
        let res = 1;
        for (let i = num; i > 0; i--) res *= i;
        display.value = res;
        setInfo(`Factorial calculado.`);
    });

    // Operaciones Binarias
    const setBinaryOp = (op, msg) => {
        if (!validate()) return;
        firstNum = Number(display.value);
        currentOp = op;
        display.value = "";
        setInfo(msg);
    };

    document.getElementById('add').addEventListener('click', () => setBinaryOp("+", "Operación de suma preparada."));
    document.getElementById('mul').addEventListener('click', () => setBinaryOp("*", "Operación de multiplicación preparada."));
    document.getElementById('div').addEventListener('click', () => setBinaryOp("/", "Operación de división preparada."));
    document.getElementById('pow').addEventListener('click', () => setBinaryOp("^", "Potenciación: Introduce el exponente."));

    document.getElementById('eq').addEventListener('click', () => {
        if (!validate() || firstNum === null) return;
        let secondNum = Number(display.value);
        let res = 0;
        let opName = "";

        if (currentOp === "+") { res = firstNum + secondNum; opName = "Suma"; }
        else if (currentOp === "*") { res = firstNum * secondNum; opName = "Multiplicación"; }
        else if (currentOp === "^") { res = Math.pow(firstNum, secondNum); opName = "Potenciación"; }
        else if (currentOp === "/") {
            if (secondNum === 0) {
                logError("Error: Se ha intentado dividir entre 0.");
                return;
            }
            res = firstNum / secondNum;
            opName = "División";
        }
        
        display.value = res;
        setInfo(`Operación: ${opName}. El resultado es ${res}`);
        firstNum = null;
        currentOp = null;
    });

    // Operaciones CSV
    const getCsv = () => display.value.split(",");

    document.getElementById('csv-sum').addEventListener('click', () => {
        if (!validate(true)) return;
        let arr = getCsv();
        let sum = arr.reduce((acc, curr) => acc + Number(curr), 0);
        display.value = sum;
        setInfo(`Lista procesada: se han sumado los valores. El resultado es ${sum}`);
    });

    document.getElementById('csv-mean').addEventListener('click', () => {
        if (!validate(true)) return;
        let arr = getCsv();
        let sum = arr.reduce((acc, curr) => acc + Number(curr), 0);
        let mean = sum / arr.length;
        display.value = mean;
        setInfo(`Lista procesada: El cálculo de la media es ${mean}`);
    });

    document.getElementById('csv-sort').addEventListener('click', () => {
        if (!validate(true)) return;
        let arr = getCsv();
        display.value = arr.sort((a, b) => Number(a) - Number(b)).join(",");
        setInfo(`Valores ordenados ascendentemente.`);
    });

    document.getElementById('csv-reverse').addEventListener('click', () => {
        if (!validate(true)) return;
        display.value = getCsv().reverse().join(",");
        setInfo(`El orden de la lista CSV ha sido invertido.`);
    });

    document.getElementById('csv-del').addEventListener('click', () => {
        if (!validate(true)) return;
        let target = prompt("¿Qué valor exacto deseas eliminar de la lista?");
        if (target !== null && target.trim() !== "") {
            let arr = getCsv();
            let newArr = arr.filter(item => item.trim() !== target.trim());
            if (arr.length === newArr.length) {
                logError("Error: El elemento especificado no se encontró en la lista.");
            } else {
                display.value = newArr.join(",");
                setInfo(`Elemento '${target}' eliminado de la lista.`);
            }
        }
    });

    // Descarga del Log de errores
    document.getElementById('download-log').addEventListener('click', () => {
        if (errorLog.length === 0) {
            alert("No hay errores registrados.");
            return;
        }
        const blob = new Blob([errorLog.join("\n")], { type: "text/plain" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "registro_errores_calculadora.txt";
        a.click();
    });
});