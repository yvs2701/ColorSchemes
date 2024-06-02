import json
import torch
from torch.utils.data import DataLoader
import pandas as pd


class ProcessData:
    def __init__(self):
        pass

    def load_json_data(self):
        json_data = json.load(open('./dataset/text-to-image-dataset.json', 'r'))
        return json_data

    def load_csv_data(self):
        dataset = pd.read_csv('./dataset/text-to-image-dataset-converted.csv')
        return dataset

    def json_to_csv(self, json_data):
        dataset = pd.DataFrame(columns={'prompt': pd.Series(dtype=str), 'imgURL': pd.Series(dtype=str), 'colors': pd.Series(dtype=object)})

        for obj in json_data:
            prompt = obj['data']['prompt']
            for img in obj['data']['images']:
                colors = img['colors']
                imgURL = img['imgURL']
            dataset.loc[len(dataset.index)] = [prompt, imgURL, colors]

        dataset.to_csv('./dataset/text-to-image-dataset-converted.csv')
        return dataset

    def preprocess(self, df):
        def hex_to_rgb(hex_list_str: str):
            rgb_list = []
            hex_list = hex_list_str.strip('[]').split(', ')

            for hex in hex_list:
                hex = hex.strip('"\'')
                rgb = []
                for i in (1, 3, 5):  # hexcodes must be strictly 6 characters + 1 ('#')
                    decimal = int(hex[i:i+2], 16)
                    rgb.append(decimal)

                rgb_list.append(rgb)

            return list(rgb_list)

        df['colors'] = df['colors'].apply(hex_to_rgb)
        df = df[['colors']]
        df.rename(columns={'colors': 'output'}, inplace=True)

        def random_filter(x: list):
            rand_indices = torch.randint(low=0, high=len(x), size=(2, 1), generator=torch.manual_seed(111))
            rand_indices.sort()
            out = [x[index] for index in rand_indices]
            return out

        df['input'] = df['output'].apply(random_filter)
        df = df[['input', 'output']]
        return df

    def split_train_test(self, df):
        train_data = df['output']
        train_data_length = len(train_data)
        print(train_data_length)
        train_labels = torch.zeros(train_data_length)
        train_set = [(torch.tensor(train_data[i]), train_labels[i])
                    for i in range(train_data_length)]

        BATCH_SIZE = 32
        train_loader = DataLoader(train_set, batch_size=BATCH_SIZE, shuffle=True, drop_last=True)

        return BATCH_SIZE, train_loader
