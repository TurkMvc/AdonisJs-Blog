'use strict'
const Yazilar = use("App/Models/Yazilar")
const Kategoriler = use("App/Models/Kategoriler")
const Yorumlar = use("App/Models/Yorumlar")
const { validate } = use('Validator')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

class YazilarController {
  async index ({ params, view }) {
    const kategoriler = await Kategoriler.all()
    const yorumlar = await Yorumlar.query().with("yazilar").limit(4).fetch() 
    const sayfa_degisken=params.sayfa ? params.sayfa : 1
    const yazilar = await Yazilar.query().with("kategori").with("yorum").orderBy("onecikan","desc").paginate(sayfa_degisken ,9)  
    if(sayfa_degisken > yazilar.toJSON().lastPage){
      const yazilar = await Yazilar.query().with("kategori").with("yorum").orderBy("onecikan","desc").paginate(1 ,9)
      return view.render("anasayfa",{yazilar:yazilar.toJSON(),kategoriler:kategoriler.toJSON(),yorumlar:yorumlar.toJSON()})
    }else{
      const yazilar = await Yazilar.query().with("kategori").with("yorum").orderBy("onecikan","desc").paginate(sayfa_degisken ,9)
      return view.render("anasayfa",{yazilar:yazilar.toJSON(),kategoriler:kategoriler.toJSON(),yorumlar:yorumlar.toJSON()})
    }
  }
  async yorum_ekle ({ params, request, session,response }) {
    const isim = request.input('isim')
    const email = request.input('email')
    const yorum = request.input('yorum')
    const yazi_id = params.id

    const yorumlar = await Yorumlar.create({
      isim:isim,
      email:email,
      yorum:yorum,
      yazi_id:yazi_id
    })
    session.flash({successMessage:"Yorumunuz Onaylandıktan Sonra Gösterilecektir"})
    return response.route("yazilar.yazi",{ yazi: "lorem_ipsum_nedir1" })
  }
  async kategori_kategori ({ params, view }) { 
    const kategori = params.kategori
    const kategoriler = await Kategoriler.all()
    const yorumlar = await Yorumlar.query().with("yazilar").limit(4).fetch() 
    const sayfa_degisken=params.sayfa ? params.sayfa : 1
    const yazilar = await Yazilar.query().with("kategori").where("kategori_url",kategori).with("yorum").orderBy("onecikan","desc").orderBy("id","desc").paginate(sayfa_degisken ,9)  
    if(sayfa_degisken > yazilar.toJSON().lastPage){
      const yazilar = await Yazilar.query().with("kategori").where("kategori_url",kategori).with("yorum").orderBy("onecikan","desc").orderBy("id","desc").paginate(1 ,9)
      return view.render("kategori",{yazilar:yazilar.toJSON(),kategoriler:kategoriler.toJSON(),yorumlar:yorumlar.toJSON(),kategori})
    }else{
      const yazilar = await Yazilar.query().with("kategori").where("kategori_url",kategori).with("yorum").orderBy("onecikan","desc").orderBy("id","desc").paginate(sayfa_degisken ,9)
      return view.render("kategori",{yazilar:yazilar.toJSON(),kategoriler:kategoriler.toJSON(),yorumlar:yorumlar.toJSON(),kategori})
    }
  }
  async show ({ params,view }){
    const kategoriler = await Kategoriler.all()
    const yorumlar = await Yorumlar.query().with("yazilar").limit(4).fetch()
    const yazi = await Yazilar.query().with("kategori").with("yorum", (builder) => {builder.where('onay', true)}).where("url",params.yazi).fetch() 
    return view.render("yazi",{yazi:yazi.toJSON(),kategoriler:kategoriler.toJSON(),yorumlar:yorumlar.toJSON()})
  }
  async edit ({ params, request, response, view }) {
  }
  async update ({ params, request, response }) {
  }
  async destroy ({ params, request, response }) {
  }
}
module.exports = YazilarController