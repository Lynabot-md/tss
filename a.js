const express = require('express');
const ytdl = require('@distube/ytdl-core');
const app = express();
const port = 25532;

app.get('/download', async (req, res) => {
    try {
        const url = req.query.url;  // Recebe a URL do vídeo do YouTube através da query string
        if (!url) {
            return res.status(400).json({ error: 'URL do vídeo é obrigatória' });
        }

        // Obtém informações do vídeo
        const info = await ytdl.getInfo(url);
        const title = info.videoDetails.title;
        const format = ytdl.chooseFormat(info.formats, { quality: 'highestaudio' });

        res.header('Content-Disposition', `attachment; filename="${title}.mp3"`);
        res.header('Content-Type', 'audio/mpeg');

        // Envia o stream de áudio diretamente para o cliente
        ytdl(url, { quality: 'highestaudio' })
            .pipe(res)
            .on('finish', () => {
                console.log(`Download concluído: ${title}`);
            });

    } catch (error) {
        console.error('Erro ao baixar o áudio:', error);
        res.status(500).json({ error: 'Erro ao processar o download' });
    }
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});