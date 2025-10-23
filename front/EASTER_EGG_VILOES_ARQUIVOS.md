# 🦹‍♂️ Easter Egg de Vilões - Arquivos Necessários

## 📁 Imagens dos Vilões (pasta `/public`)

### DC Villains:
- `/joker.png` - Imagem do Coringa
- `/harleyquinn.png` - Imagem da Alerquina  
- `/lexluthor.png` - Imagem do Lex Luthor
- `/bane.png` - Imagem do Bane
- `/darkseid.png` - Imagem do Darkseid
- `/suicidesquad.png` - Imagem do Esquadrão Suicida

### Marvel Villains:
- `/thanos.png` - Imagem do Thanos
- `/doom.png` - Imagem do Doutor Destino
- `/greengoblin.png` - Imagem do Duende Verde
- `/loki.png` - Imagem do Loki
- `/redskull.png` - Imagem da Caveira Vermelha
- `/ultron.png` - Imagem do Ultron

## 🎵 Áudios dos Vilões (pasta `/public/audio`)

### DC Villains:
- `/audio/joker-laugh.mp3` - Risada do Coringa
- `/audio/harleyquinn-theme.mp3` - Tema da Alerquina
- `/audio/lexluthor-theme.mp3` - Tema do Lex Luthor
- `/audio/bane-theme.mp3` - Tema do Bane
- `/audio/darkseid-theme.mp3` - Tema do Darkseid
- `/audio/suicidesquad-theme.mp3` - Tema do Esquadrão Suicida

### Marvel Villains:
- `/audio/thanos-snap.mp3` - Estalar do Thanos (Easter Egg principal para Marvel)
- `/audio/doom-theme.mp3` - Tema do Doutor Destino
- `/audio/greengoblin-theme.mp3` - Tema do Duende Verde
- `/audio/loki-theme.mp3` - Tema do Loki
- `/audio/redskull-theme.mp3` - Tema da Caveira Vermelha
- `/audio/ultron-theme.mp3` - Tema do Ultron

### Áudio Geral:
- `/audio/villain-laugh.mp3` - Risada geral para DC (Easter Egg principal para DC)

## 🎬 Vídeos dos Vilões (URLs Supabase)

### DC Villains:
- `joker.mp4`
- `harleyquinn.mp4`
- `lexluthor.mp4`
- `bane.mp4`
- `darkseid.mp4`
- `suicidesquad.mp4`

### Marvel Villains:
- `thanos.mp4`
- `doom.mp4`
- `greengoblin.mp4`
- `loki.mp4`
- `redskull.mp4`
- `ultron.mp4`

## 🎮 Como Funciona o Easter Egg

1. **Timer**: 15 segundos após o usuário estar logado na página
2. **Efeito Visual**: Overlay dramático com múltiplos flashes (roxo, branco, preto, vermelho) por 5.5 segundos
3. **Áudio**: 
   - DC: Toca risada do Coringa (`joker-laugh.mp3`)
   - Marvel: Toca estalar do Thanos (`thanos-snap.mp3`)
4. **SpeechBubble Electric**: Aparece balão elétrico centralizado no meio da tela com texto "Achou que era só sobre os 'mocinhos'?"
5. **Vilões**: Após 5.5 segundos (fim do evento), os cards dos vilões aparecem permanentemente na galeria
6. **Interação**: Vilões são clicáveis e tocam seus temas musicais

## 🎨 Estilos Visuais

- **Cards de Vilões**: Bordas vermelhas escuras, hover vermelho brilhante
- **Animação**: Vilões aparecem com rotação e escala
- **Overlay de Invasão**: Overlay fixo cobrindo toda a tela com animação dramática
- **SpeechBubble Electric**: Balão elétrico centralizado com animação de aparecimento
- **Efeito de Flash**: Sequência dramática de cores (roxo → branco → preto → vermelho) por 5.5 segundos

## 📝 Observações

- O Easter Egg só funciona quando o usuário está logado
- **IMPORTANTE**: Os vilões NÃO aparecem no estado inicial - apenas após o evento rodar
- Os vilões aparecem baseados na afiliação selecionada (Marvel ou DC)
- Se a afiliação for "all", os vilões não aparecem
- Cada vilão tem seu próprio áudio e vídeo individual
- O Easter Egg pode ser disparado múltiplas vezes
- Os vilões ficam permanentemente visíveis após o evento terminar
