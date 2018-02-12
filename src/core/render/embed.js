import { get } from '../fetch/ajax'
import { merge } from '../util/core'

const cached = {}

function walkFetchEmbed ({ step = 0, embedTokens, compile, fetch }, cb) {
  const token = embedTokens[step]

  if (!token) {
    return cb({})
  }

  const next = text => {
    let embedToken
    if (text) {
      if (token.embed.type === 'markdown') {
        embedToken = compile.lexer(text)
      } else if (token.embed.type === 'code') {
        embedToken = compile.lexer(
          '```' +
            token.embed.lang +
            '\n' +
            text.replace(/`/g, '@DOCSIFY_QM@') +
            '\n```\n'
        )
      }
    }
    cb({ token, embedToken })
    walkFetchEmbed({ step: ++step, compile, embedTokens, fetch }, cb)
  }

  if (process.env.SSR) {
    fetch(token.embed.url).then(next)
  } else {
    get(token.embed.url).then(next)
  }
}

export function prerenderEmbed ({ compiler, raw, fetch }, done) {
  let hit
  if ((hit = cached[raw])) {
    return done(hit)
  }

  const compile = compiler._marked
  let tokens = compile.lexer(raw)
  const embedTokens = []
  const linkRE = compile.InlineLexer.rules.link
  const links = tokens.links

  tokens.forEach((token, index) => {
    if (token.type === 'paragraph') {
      token.text = token.text.replace(
        new RegExp(linkRE, 'g'),
        (src, filename, href, title) => {
          const embed = compiler.compileEmbed(href, title)

          if (embed) {
            if (embed.type === 'markdown' || embed.type === 'code') {
              embedTokens.push({
                index,
                embed
              })
            }
            return embed.code
          }

          return src
        }
      )
    }
  })

  let moveIndex = 0
  walkFetchEmbed({ compile, embedTokens, fetch }, ({ embedToken, token }) => {
    if (token) {
      const index = token.index + moveIndex

      merge(links, embedToken.links)

      tokens = tokens
        .slice(0, index)
        .concat(embedToken, tokens.slice(index + 1))
      moveIndex += embedToken.length - 1
    } else {
      cached[raw] = tokens.concat()
      tokens.links = cached[raw].links = links
      done(tokens)
    }
  })
}
