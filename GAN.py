from torch import nn, reshape, cat


class Generator(nn.Module):
    def __init__(self):
        super().__init__()
        self.sample_in = None
        self.sample_out = None
        # # V2:
        # nn.Linear(6, 128),
        # nn.LeakyReLU(),
        # nn.Dropout(0.1),
        # nn.Linear(128, 60),
        # nn.LeakyReLU(),
        # nn.Linear(60, 49),
        # nn.LeakyReLU(),
        # nn.Linear(49, 9),
        # nn.Sigmoid() # to contain the output in a range

        # # V3:
        # nn.Linear(6, 128),
        # nn.LeakyReLU(),
        # nn.Linear(128, 94),
        # nn.LeakyReLU(),
        # nn.Linear(94, 72),
        # nn.LeakyReLU(),
        # nn.Linear(72, 56),
        # nn.LeakyReLU(),
        # nn.Linear(56, 9),
        # nn.Sigmoid() # to contain the output in a range
        # # V1 and V4:
        self.model = nn.Sequential(
            nn.Linear(6, 18),
            nn.LeakyReLU(),

            nn.Linear(18, 27),
            nn.LeakyReLU(),

            nn.Linear(27, 9),
            nn.Sigmoid()  # to contain the output in a range
        )

    def forward(self, x):
        # change the range from [0-255] to [0-1]
        input = reshape(x, shape=(x.size(dim=0), 6)) / 255
        output = self.model(input)
        # change the range from [0-1] to [0-255]
        output = reshape(output, shape=(x.size(dim=0), 3, 3)) * 255
        output = cat((x, output), dim=1)
        return output


class Discriminator(nn.Module):
    def __init__(self):
        super().__init__()
        self.model = nn.Sequential(
            nn.Linear(15, 256),
            nn.LeakyReLU(),
            nn.Dropout(0.3),

            nn.Linear(256, 128),
            nn.LeakyReLU(),
            nn.Dropout(0.3),

            nn.Linear(128, 64),
            nn.LeakyReLU(),
            nn.Dropout(0.3),

            nn.Linear(64, 1),
            nn.Sigmoid()  # 0 means input was fake and 1 means input was real
        )

    def forward(self, x):
        x = reshape(x, shape=(x.size(dim=0), 15))
        output = self.model(x)
        output = reshape(output, shape=(x.size(dim=0), 1))
        return output
