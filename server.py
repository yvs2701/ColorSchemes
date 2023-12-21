import base64
from flask import Flask, send_from_directory, request, jsonify
from flask_cors import CORS
from DominantColors import DominantColors
from ThemeGenerator import ThemeGenerator
import numpy as np
import os


app = Flask(__name__, static_url_path='', static_folder='frontend/build')
cors = CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})


def rgb_to_hex(rgb: list[int]) -> str:
    return '#{:02x}{:02x}{:02x}'.format(rgb[0], rgb[1], rgb[2])


@app.route('/api/extract_colors', methods=['POST'])
def extract_colors():
    try:
        if 'imgData' not in request.form.keys():
            raise KeyError('File \'imgData\' missing in the request')

        img = request.form['imgData'].split("base64,")[1]
        img = base64.decodebytes(bytes(img, "utf-8"))

        # Thanks to: https://stackoverflow.com/a/48002503
        data = np.frombuffer(img, np.uint8)

        if 'noOfColors' in request.form.keys():
            noOfColors = int(request.form['noOfColors'])
        else:
            noOfColors = 5

        dc = DominantColors(image=data, clusters=noOfColors)
        colors = dc.extractColors()
        hexcodes = []

        for _, swatch in enumerate(colors):
            hexcodes.append(rgb_to_hex(swatch))

        return jsonify({'hex_colors': hexcodes, 'rgb_colors': colors}), 200

    except KeyError:
        return jsonify({'error': 'File \'imgData\' missing in the request'}), 400


@app.route('/api/generate_colors', methods=['POST'])
def generate_colors():
    req = request.get_json()
    try:
        base_color = req['rgb_color']
        tg = ThemeGenerator(base_color=base_color, isRGB=True)
        theme = tg.generate()
        hexcodes = []

        for _, swatch in enumerate(theme):
            hexcodes.append(rgb_to_hex(swatch))

        labels = ['primary_color', 'secondary_color',
                  'primary_tint', 'secondary_tint',
                  'primary_shadow', 'secondary_shadow']

        dict_theme = dict(zip(labels, theme))
        dict_hexcodes = dict(zip(labels, hexcodes))

        return jsonify({'hex_colors': dict_hexcodes, 'rgb_colors': dict_theme}), 200

    except KeyError:
        return jsonify({'error': 'rgb_color not found in request'}), 400


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serverFrontend(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')


if __name__ == '__main__':
    app.run(debug=True, host='3000')
