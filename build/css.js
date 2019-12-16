const fs = require('fs')
const path = require('path')
const {spawn} = require('child_process')

const args = process.argv.slice(2)
fs.readdir(path.join(__dirname, '../src/themes'), (err, files) => {
    if (err) {
        console.log('err', err)
        return
    }
    files.map(async (file) => {
        if (/\.styl/g.test(file)) {
            var stylusCMD;
            const stylusBin = ['node_modules', 'stylus', 'bin', 'stylus'].join(path.sep)
            var cmdargs = [
                stylusBin,
                `src/themes/${file}`,
                '-u',
                'autoprefixer-stylus'
            ]
            cmdargs = cmdargs.concat(args)

            stylusCMD = spawn('node', cmdargs, { shell: true })

            stylusCMD.stdout.on('data', (data) => {
                console.log(`[Stylus Build ] stdout: ${data}`);
            });

            stylusCMD.stderr.on('data', (data) => {
                console.error(`[Stylus Build ] stderr: ${data}`);
            });

            stylusCMD.on('close', (code) => {
                console.log(`[Stylus Build ] child process exited with code ${code}`);
            });
        } else {
            return
        }

    })
})