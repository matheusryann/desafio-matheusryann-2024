import { RecintosZoo } from './recintos-zoo.js';

const zoo = new RecintosZoo();

// Teste para um caso válido
console.log(zoo.analisaRecintos('MACACO', 2));

// Teste para um caso inválido
console.log(zoo.analisaRecintos('UNICORNIO', 1));

