ffmpeg -i input.gif \
       -vf "fps=30,split[s0][s1];[s0]palettegen=max_colors=128:reserve_transparent=0[p];[s1][p]paletteuse" \
       -b:v 500k \
       output_white_bg.gif
# For Light

ffmpeg -i input.gif -vf "fps=30" -b:v 500k output.gif
# For dark
