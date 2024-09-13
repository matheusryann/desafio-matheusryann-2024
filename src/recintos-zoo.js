class RecintosZoo {
    constructor() {
        // Dados dos recintos e animais
        this.recintos = [
            { numero: 1, bioma: "savana", tamanho: 10, animais: ["macaco", "macaco", "macaco"] },
            { numero: 2, bioma: "floresta", tamanho: 5, animais: [] },
            { numero: 3, bioma: "savana e rio", tamanho: 7, animais: ["gazela"] },
            { numero: 4, bioma: "rio", tamanho: 8, animais: [] },
            { numero: 5, bioma: "savana", tamanho: 9, animais: ["leao"] },
        ];

        this.animais = [
            { especie: "leao", tamanho: 3, bioma: "savana", carnivoro: true },
            { especie: "leopardo", tamanho: 2, bioma: "savana", carnivoro: true },
            { especie: "crocodilo", tamanho: 3, bioma: "rio", carnivoro: true },
            { especie: "macaco", tamanho: 1, bioma: "savana ou floresta", carnivoro: false },
            { especie: "gazela", tamanho: 2, bioma: "savana", carnivoro: false },
            { especie: "hipopotamo", tamanho: 4, bioma: "savana ou rio", carnivoro: false },
        ];
    }

    // Função para verificar se há espécies diferentes no recinto
    temEspecieDiferentes(recinto) {
        const especies = new Set(recinto.animais);
        return especies.size > 1;
    }

    // Verifica se há carnívoros no recinto
    temCarnivoro(recinto) {
        return recinto.animais.some(animal => {
            const animalExistente = this.animais.find(a => a.especie === animal);
            return animalExistente && animalExistente.carnivoro;
        });
    }

    // Verifica se o bioma do recinto é compatível com o bioma do animal
    biomaCompativel(animalInfo, recinto) {
        const biomasAnimal = animalInfo.bioma.split(' ou '); // Lista de biomas onde o animal pode viver
        const biomasRecinto = recinto.bioma.split(' e '); // Lista de biomas do recinto
        return biomasRecinto.some(bioma => biomasAnimal.includes(bioma)); // Verifica se ao menos um bioma do recinto é compatível
    }

    // Função principal para análise de recintos
    analisaRecintos(animal, quantidade) {
        // Validações básicas de entrada
        const animalInfo = this.animais.find(a => a.especie.toLowerCase() === animal.toLowerCase());
        if (!animalInfo) {
            return { erro: "Animal inválido" };
        }
        if (quantidade <= 0 || !Number.isInteger(quantidade)) {
            return { erro: "Quantidade inválida" };
        }

        // Filtra os recintos viáveis
        const recintosDisponiveis = this.recintos.filter(recinto => {
            // Verifica se o bioma do recinto é exatamente compatível com o bioma do animal
            if (!this.biomaCompativel(animalInfo, recinto)) {
                return false;
            }

            // Cálculo do espaço ocupado no recinto
            const espacoOcupado = recinto.animais.reduce((total, especie) => {
                const animalExistente = this.animais.find(a => a.especie === especie);
                return total + (animalExistente ? animalExistente.tamanho : 0);
            }, 0);

            // Espaço restante no recinto
            let espacoDisponivel = recinto.tamanho - espacoOcupado;

            // Se há mais de uma espécie, considera 1 espaço extra
            if (this.temEspecieDiferentes(recinto) && !recinto.animais.includes(animal)) {
                espacoDisponivel -= 1;
            }

            // Verifica se há espaço suficiente para a quantidade de novos animais
            const espacoNecessario = animalInfo.tamanho * quantidade;
            if (espacoDisponivel < espacoNecessario) {
                return false;
            }

            // Carnívoros só podem estar com a própria espécie
            if (this.temCarnivoro(recinto) && !animalInfo.carnivoro) {
                return false; // Se o recinto tem carnívoro, o macaco não pode estar lá
            }

            if (animalInfo.carnivoro && recinto.animais.some(a => a !== animal)) {
                return false;
            }

            // Hipopótamos só convivem com outras espécies em "savana e rio"
            if (animal === 'hipopotamo' && recinto.bioma !== "savana e rio" && recinto.animais.length > 0) {
                return false;
            }

            // Macacos não podem ficar sozinhos
            if (animal === 'macaco' && recinto.animais.length === 0) {
                return false;
            }

            // Verifica se todos os animais já presentes continuarão confortáveis
            const todosAnimaisConfortaveis = recinto.animais.every(especie => {
                const animalExistente = this.animais.find(a => a.especie === especie);
                if (!animalExistente) return false;
                const biomaCompativelComExistente = this.biomaCompativel(animalExistente, recinto);
                return biomaCompativelComExistente && (espacoDisponivel >= animalExistente.tamanho);
            });

            if (!todosAnimaisConfortaveis) {
                return false;
            }

            return true;
        });

        // Formata a saída
        if (recintosDisponiveis.length > 0) {
            const recintosFormatados = recintosDisponiveis.map(recinto => {
                const espacoOcupado = recinto.animais.reduce((total, especie) => {
                    const animalExistente = this.animais.find(a => a.especie === especie);
                    return total + (animalExistente ? animalExistente.tamanho : 0);
                }, 0);
                let espacoDisponivel = recinto.tamanho - espacoOcupado;

                // Se há mais de uma espécie, considera 1 espaço extra
                if (this.temEspecieDiferentes(recinto) && !recinto.animais.includes(animal)) {
                    espacoDisponivel -= 1;
                }

                const espacoNecessario = animalInfo.tamanho * quantidade;
                espacoDisponivel -= espacoNecessario;

                return `Recinto ${recinto.numero} (espaço livre: ${espacoDisponivel} total: ${recinto.tamanho})`;
            });
            return { recintosViaveis: recintosFormatados };
        } else {
            return { erro: "Não há recinto viável" };
        }
    }
}  


export { RecintosZoo as RecintosZoo };
