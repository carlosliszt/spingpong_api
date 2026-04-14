class Usuario {
    constructor(data) {
        this.id = data.id;
        this.nome = data.nome;
        this.email = data.email;
        this.senha_hash = data.senha_hash;
        this.papel = data.papel;
        this.ativo = data.ativo;
        this.created_at = data.created_at;
        this.updated_at = data.updated_at;
    }

    toJSON() {
        const { senha_hash, ...safeData } = this;
        return safeData;
    }
}

module.exports = Usuario;

