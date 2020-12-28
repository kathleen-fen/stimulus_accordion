const HtmlWebpackPlugin = require('html-webpack-plugin'); // создает index.html в папке dist с подключением js из входных точек
const path = require('path');// путь к текущей папке
const { CleanWebpackPlugin } = require('clean-webpack-plugin');// очищает папку dist
const CopyPlugin = require("copy-webpack-plugin");//статическое копирование файлов
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); //весь css в один файл
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const { opts } = require('commander');

const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;
//console.log('Is dev', isDev);

const optimization = () => {
  const config = {
    splitChunks: {
      chunks: 'all' // создает например для jqwery отдельный файл, вместо того, чтобы дублтровать библиотеку во все 
    },
   
  };
  if (isProd) {
    config.minimizer = [new CssMinimizerPlugin(),];
    config.minimize = true;
  }
  return config
}

const filename = ext => isDev ? `[name].${ext}` : `[name].[hash].${ext}`; // чтобы не было хэшей при dev сборке

const babelOptions = preset =>  {
  const opts = {
    presets: [
      '@babel/preset-env',
    ],
    plugins: ['@babel/plugin-proposal-class-properties'], // плагтн,чтобы использовать классы
  }

  if(preset) {
    opts.presets.push(preset);
  }
  return  opts;
}

module.exports = {
    context: path.resolve(__dirname,'src'), //папка с исходными файлами
    mode:'development', //если не указывать режим в команде webpack будет development, а так в package.json пишем команду dev и build и запускаем npm run dev или build
    entry: {
        main: ['@babel/polyfill', './index.js'], //входная точка + babel polifill чтобы работала async await, jsx это для react
      //  analytics: './analytics.ts'// входная точка
    },
    output: {
        filename: filename('.js'), //выходной js файл, name - имя входной точки,  contenthash - хэш, каждый раз новый чтобы оличать версии в кэше например
        path: path.resolve(__dirname, 'dist') // dist папка в текущей папке, куда будем складывать бандлы
    },
    devServer: {// server, 
      contentBase: path.join(__dirname, 'dist'),
      compress: true,
      port: 9000,
      hot: isDev,
      open: isDev,
    },
    resolve: {
      extensions: ['.js', '.json'], // теперь эти расширения при импорте можно не указывать
      alias: {
       // '@models': path.resolve(__dirname, 'src/models'),
        '@': path.resolve(__dirname, 'src'), 
      },
    }, 
    optimization: optimization(),
    devtool: isDev ? 'source-map' : '',//исходные карты
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({ //копирует html и подключает  js
         //   title: 'Webpack for Kate', //для хтмл заголовок, не имеет смысла если задан тэмплэйт
            template: './index.html', // исходный без подключенных js
            minify: {
              collapseWhitespace: isProd,// если режим production  то минифицируем html
            }
        }),
        new CopyPlugin({
          patterns: [
            { from: path.resolve(__dirname,"src/favicon.ico"), to: path.resolve(__dirname,"dist") },
          ],
        }),
        new MiniCssExtractPlugin({
          filename: filename('.css'),
        }),
    ],
    //loaders 
    module: {
        rules: [
          {
            test: /\.css$/i,
            use: [{
              loader: MiniCssExtractPlugin.loader,
              options: {
                publicPath: '',
              },
            },
            'css-loader',], //загружает  css через импорт в js файлах
          },
          {
            test: /\.less$/i,
            use: [{
              loader: MiniCssExtractPlugin.loader,
              options: {
                publicPath: '',
              },
            },
            'css-loader',
            'less-loader'], //загружает  css через импорт в js файлах
          },
          {
            test: /\.s[ac]ss$/i,
            use: [
              {
                loader: MiniCssExtractPlugin.loader,
                options: {
                  publicPath: '',
                },
              },
              'css-loader',
              {
                loader: "sass-loader",
                options: {
                  // Prefer `dart-sass`
                  implementation: require("sass"),
                },
              },
            ],
          },
          {
            test: /\.(png|jpe?g|gif)$/i, 
            use: [
              {
                loader: 'file-loader' //загружает картинки через импорт, дает другое имя, ужимает
              },
            ],
          },
          {
            test: /\.(ttf|wof|wo2|eot)$/, 
            use: [
              {
                loader: 'file-loader' //загружает картинки через импорт, дает другое имя, ужимает
              },
            ],
          },
          {
            test: /\.xml$/i,
            use: ['xml-loader'],
          },
          {
            test: /\.(csv|tsv)$/i,
            use: ['csv-loader'],
          },
          {
            test: /\.m?js$/, //babel, чтобы использовать новое в js,которе еще не включено в стандарт
            exclude: /node_modules/,
            use: {
              loader: "babel-loader",
              options: babelOptions(),
            }
          },
          {
            test: /\.ts$/, //babel, чтобы использовать typescrypt
            exclude: /node_modules/,
            use: {
              loader: "babel-loader",
              options: babelOptions('@babel/preset-typescript'),
            }
          },
          {
            test: /\.jsx$/, //babel, чтобы использовать typescrypt
            exclude: /node_modules/,
            use: {
              loader: "babel-loader",
              options: babelOptions('@babel/preset-react'),
            }
          },
        ],
      },
} 