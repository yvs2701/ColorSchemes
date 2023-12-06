from DominantColors import DominantColors
from ThemeGenerator import ThemeGenerator

if __name__ == '__main__':
    imgPath = 'static/samples/3.jpg'
    dc = DominantColors(imgPath)
    colors = dc.extractColors()
    print(colors)
    tg = ThemeGenerator(colors[-1])
    theme = tg.generate()
    print(theme)

    # NOTE: CONVERT TO HEXCODE
    for idx, swatch in enumerate(theme):
        theme[idx] = [dc.rgb_to_hex(swatch)]
    print(theme)
