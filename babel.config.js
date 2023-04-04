module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    env: {
      production: {
        plugins: ['@babel/transform-react-jsx-source'],
      },
    },
    plugins: [
      [
        'module-resolver',
        {
          alias: {
            '~': './',
          },
        },
      ],
    ],
  };
};
