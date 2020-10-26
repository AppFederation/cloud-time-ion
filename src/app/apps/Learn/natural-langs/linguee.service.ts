import { Injectable } from '@angular/core';
import {errorAlert} from '../../../libs/AppFedShared/utils/log'


const genderToArticle = {
  masculine: 'der',
  feminine: 'die',
  neuter: 'das',
}

@Injectable({
  providedIn: 'root'
})
export class LingueeService {

  /*
  https://www.deepl.com/de/docs-api/?part=xml
   https://github.com/imankulov/linguee-api
   https://linguee-api.herokuapp.com/api?q=bacalhau&src=pt&dst=en

   https://wordnet.princeton.edu/
  * */

  constructor() { }

  async doIt(input: string) {
    return; // Disabled
    if ( ! input ) {
      return
    }
    try {
      const response = await fetch(`https://linguee-api.herokuapp.com/api?q=${input}&src=de&dst=en`)

      const json = await response.json()
      console.log(`Linguee response 1`, json)

      /* word_type:
          plural: true
          pos: "noun"
        */
      for ( let match of json.exact_matches ) {
        let genderArticle = (genderToArticle as any)[match.word_type.gender]
        console.log(`---` + genderArticle)
        console.log(`---` + match.text)
        for ( let translation of match.translations ) {
          console.log(translation.text)

        }
      }
      console.log(`Linguee response`, json.exact_matches[0].translations[0].text)
    } catch (error: any) {
      errorAlert(`Linguee error`, error)
    }

  }
}

const apiExample = {
  "src_lang": "pt",
  "dst_lang": "en",
  "query": "bacalhau",
  "correct_query": "bacalhau",
  "exact_matches": [
    {
      "featured": true,
      "wt": 106,
      "lemma_id": "PT:bacalhau15074",
      "text": "bacalhau",
      "word_type": {
        "pos": "noun",
        "gender": "masculine"
      },
      "audio_links": [
        {
          "url_part": "PT_BR/65/65a64219bee1527a36dcf405531d29ee-106",
          "lang": "Brazilian Portuguese"
        },
        {
          "url_part": "PT_PT/65/65a64219bee1527a36dcf405531d29ee-106",
          "lang": "European Portuguese"
        }
      ],
      "forms": [
        {
          "text": "bacalhaus",
          "form_type": {
            "pos": "noun",
            "gender": "masculine"
          }
        }
      ],
      "translations": [
        {
          "featured": true,
          "text": "cod",
          "bid": "10000944878",
          "lemma_id": "EN:cod9792",
          "word_type": {
            "pos": "noun"
          },
          "audio_link": [
            {
              "url_part": "EN_US/2d/2d5278b057566a696ccff8d31ae5895b-101",
              "lang": "American English"
            },
            {
              "url_part": "EN_UK/2d/2d5278b057566a696ccff8d31ae5895b-101",
              "lang": "British English"
            }
          ],
          "examples": [
            {
              "source": "Os pescadores saíram para pescar bacalhau.",
              "target": "The fishermen have gone to fish for cod."
            }
          ]
        },
        {
          "featured": false,
          "text": "codfish",
          "bid": "10000968562",
          "lemma_id": "EN:codfish46236",
          "word_type": {
            "pos": "noun"
          },
          "audio_link": [
            {
              "url_part": "EN_US/ff/ff26302d6441676fa90aa0a858a25ebb-101",
              "lang": "American English"
            },
            {
              "url_part": "EN_UK/ff/ff26302d6441676fa90aa0a858a25ebb-101",
              "lang": "British English"
            }
          ],
          "examples": []
        }
      ]
    }
  ],
  "inexact_matches": null,
  "real_examples": [
    {
      "id": "",
      "src": "As práticas de pesca actuais representam uma ameaça séria [...] para a conservação e a reconstituição das [...] unidades populacionais de bacalhau no mar Báltico e exigem [...] uma acção imediata.",
      "dst": "Current fishing practice constitutes a [...] serious threat to the conservation and [...] the rebuilding of the cod stocks in the Baltic [...] Sea and requires immediate action.",
      "url": "http://eur-lex.europa.eu/LexUriServ/LexUriServ.do?uri=OJ:L:2003:097:0031:0031:PT:PDF"
    },
    {
      "id": "",
      "src": "É calculado o esforço de [...] pesca de todos os navios que capturam bacalhau.",
      "dst": "The fishing effort of all [...] the vessels catching cod will be calculated.",
      "url": "http://europa.eu/rapid/pressReleasesAction.do?reference=IP/03/631&format=HTML&aged=1&language=PT&guiLanguage=en"
    },
    {
      "id": "",
      "src": "Na sequência de consultas com base no presente documento e da recepção dos últimos pareceres científicos, a Comissão pretende apresentar, no [...] final do ano, propostas de regulamentos do Conselho relativas a planos de recuperação [...] completos para o bacalhau e a pescada.",
      "dst": "Following consultations on the basis of this document and the receipt of the latest scientific advice, the Commission intends to [...] present towards the end of this year proposals for Council Regulations dealing with [...] full recovery plans for cod and hake.",
      "url": "http://eur-lex.europa.eu/LexUriServ/LexUriServ.do?uri=COM:2001:0326:FIN:PT:PDF"
    },
    {
      "id": "",
      "src": "O programa de recuperação plurianual [...] agora proposto para o bacalhau e a pescada decorre [...] daquela comunicação.",
      "dst": "The current proposed multi-annual [...] recovery programme for cod and hake follows on from [...] that communication.",
      "url": "http://www.europarl.europa.eu/sides/getDoc.do?pubRef=-//EP//TEXT+CRE+20020612+ITEMS+DOC+XML+V0//PT&amp;language=PT"
    },
    {
      "id": "",
      "src": "O papel do interior [...] pede minis e pastéis de bacalhau.",
      "dst": "The paper of the inside [...] hungers for pints and codfish cookies.",
      "url": "http://serrote.com/caderno_toalha_3.htm"
    },
    {
      "id": "",
      "src": "O bacalhau do Atlântico é um dos peixes [...] alimentares mais importantes do mundo.",
      "dst": "The Atlantic cod is one of the world's [...] most important food fish.",
      "url": "http://www.phadia.com/pt-BR/Profissionais/Alergia/Alergenios-comuns/Alergenios-alimentares/"
    },
    {
      "id": "",
      "src": "Amêijoa a Bulhao Pato, seguido [...] do tradicional Bacalhau a Broa, regado [...] com um tinto excepcional que somente Delfim seria capaz de encontrar.",
      "dst": "Amêijoa a \"Bulhao Pato\" followed by [...] the traditional Bacalhao a Broa, all arosé [...] with a superb Red wine that only Delfim could find.",
      "url": "http://asasdovento.com.br/di_150901.htm"
    },
    {
      "id": "",
      "src": "Os exemplos apontados para a má gerência que poderia ter sido mitigada com o melhor uso do [...] conhecimento local incluíram o colapso [...] norte-americano da pesca do bacalhau previsto pelo conhecimento [...] local, de acordo com Diegues, mas ignorado pelo governo.",
      "dst": "Examples that he pointed to for failed management that could have been mitigated through better use of [...] local knowledge included the North [...] American collapse of the cod fishery - foreseen by [...] local knowledge, according to Dieges, but ignored by government.",
      "url": "http://worldfish.org/PPA/PDFs/Semi-Annual%20III%20Portuguese/3rd%20s.a.%20port_G6.pdf"
    },
    {
      "id": "",
      "src": "Esse aumento justifica-se como um incentivo para [...] reduzir o esforço de pesca do bacalhau fora das suas zonas protegidas.",
      "dst": "The increase is justified as an incentive to reduce [...] fishing effort on cod outside the cod protection areas.",
      "url": "http://europa.eu/rapid/pressReleasesAction.do?reference=PRES/04/275&format=HTML&aged=1&language=PT&guiLanguage=en"
    },
    {
      "id": "",
      "src": "Pode resolver este problema e [...] dizer-me em que medida o bacalhau da Mancha foi tido [...] em conta nas estatísticas mais recentes da UE?",
      "dst": "Could you resolve this for me and let me [...] know to what extent the cod in the Channel have [...] been taken into account in the latest EU statistics?",
      "url": "http://www.europarl.europa.eu/sides/getDoc.do?pubRef=-//EP//TEXT+CRE+20080422+ITEMS+DOC+XML+V0//PT&amp;language=PT"
    },
    {
      "id": "",
      "src": "No entanto, o [...] maior alergénio do bacalhau (parvalbumina) parece [...] ser um bom representante para várias espécies de peixes.",
      "dst": "However the major cod allergen (parvalbumin) [...] seems to be a good representative for many fish species.",
      "url": "http://www.phadia.com/pt-BR/Profissionais/Alergia/Alergenios-comuns/Alergenios-alimentares/"
    },
    {
      "id": "",
      "src": "Bolinho de Bacalhau: Tipo de bolo de peixe [...] com formato redondo.",
      "dst": "Bolinho de Bacalhau: Round deep-fried [...] dumpling made with cod fish and potatoes.",
      "url": "http://soulbrasileiro.com.br/main/brasil/comes-e-bebes/comidinhas-de-rua/comidinhas-de-rua/"
    },
    {
      "id": "",
      "src": "Considerando que a pesca de arenque para fins industriais no mar [...] Báltico pode induzir importantes [...] capturas acessórias de bacalhau jovem; que, em consequência, [...] a referida pesca não deve [...] ser autorizada nas zonas em que os bacalhaus jovens abundam",
      "dst": "Whereas industrial fishing for herring in [...] the Baltic Sea may induce significant [...] by-catches of young cod; whereas therefore such [...] fishing should not be permitted in [...] areas where young cod are abundant",
      "url": "http://eur-lex.europa.eu/LexUriServ/LexUriServ.do?uri=OJ:L:1998:191:0010:0012:PT:PDF"
    },
    {
      "id": "",
      "src": "A região também tem famosos restaurantes como o Siri do Galeão e o Rei do Bacalhau.",
      "dst": "The area also boasts famous restaurants like Siri do Galeão and Rei do Bacalhau.",
      "url": "http://soulbrasileiro.com.br/main/rio-de-janeiro/zonas-e-bairros/zona-norte/ilha-do-governador/ilha-do-governador/"
    },
    {
      "id": "",
      "src": "F. Considerando que nos últimos anos a União Europeia aprovou vários planos de recuperação e gestão dos recursos sobreexplorados (pescada, bacalhau, linguado enguia, lagostim) e que se prevê que será necessário alargá-los a outras espécies de valor comercial",
      "dst": "F. whereas in recent years the European Union has approved various recovery and management plans for overexploited stocks (hake, sole, eel and lobster) and it is foreseeable that these plans will have to be extended to other species of commercial value in the future",
      "url": "http://paulocasaca.com/site/files/6.pdf"
    },
    {
      "id": "",
      "src": "A sua missão era a de pôr [...] termo à sobrepesca de bacalhau, uma espécie outrora [...] abundante nas águas geladas, mas actualmente em risco de extinção.",
      "dst": "They were on a mission to stop [...] the overfishing of cod, once plentiful in [...] the icy waters, but now fast disappearing.",
      "url": "http://ec.europa.eu/news/agriculture/080729_pt.htm"
    },
    {
      "id": "",
      "src": "Atualmente, o couro não vem apenas de vacas ou porcos; também é feito de avestruz [...] ou até mesmo de bacalhau.",
      "dst": "These days, leather doesn't just come from cows or pigs; it's also made [...] from ostriches or even cod.",
      "url": "http://webmagazine.lanxess.com.br/de/pagina-inicial/couro/um-material-antigo/druck/print-page.html"
    },
    {
      "id": "",
      "src": "É especilizada em cuidados de articulações sendo mais conhecida pela sua gama de [...] suplementos de óleo de fígado de bacalhau.",
      "dst": "It is expert in care of joints being more [...] known for its range of cod liver oil supplements.",
      "url": "http://www.merck.pt/pt/pharmaceuticals/consumer_health_care/mobility/mobility.html"
    },
    {
      "id": "",
      "src": "Essas águas também abrigam uma [...] quantidade abundante de bacalhau sleepy, saratogas e [...] arenques.",
      "dst": "The waters [...] also teem with sleepy cod, saratoga and oxeye herring.",
      "url": "http://www.australia.com/pt-br/articles/nt_barra_fishing.aspx"
    },
    {
      "id": "",
      "src": "Fritar sobre o lado da escama é [...] suficiente para cozinhar o bacalhau com uma boa consistência.",
      "dst": "Frying on the crust side is [...] sufficient to cook the cod to a glazy consistency.",
      "url": "http://www.braun.com/pt/household/adviser/food-preparation/recipes-selection/recipes/codfish-medallions.html"
    },
    {
      "id": "",
      "src": "Acompanhamento: Acompanha bem pratos de bacalhau e carnes grelhadas.",
      "dst": "Tracking: Very good with cod dishes and grilled meats.",
      "url": "http://www.winehey.com/product.php?id_product=55"
    },
    {
      "id": "",
      "src": "Acompanham bem pratos de peixe gordo [...] como o salmão ou o bacalhau, podendo também ser [...] servidos com frango ou coelho acompanhados de molhos suaves.",
      "dst": "We recommend that you drink them with fatty fish dishes [...] such as salmon or salt cod, but they are equally [...] good with chicken or rabbit dishes that [...] are accompanied by mild sauces.",
      "url": "http://www.ivp.pt/pagina.asp?codPag=81&codSeccao=2&idioma=0"
    },
    {
      "id": "",
      "src": "O DFO manteve muito altas as cotas dessa [...] variedade, por razões políticas, e agora, dez anos depois de proibir sua [...] pesca, as reservas de bacalhau continuam esgotadas.",
      "dst": "The DFO kept the allowable catches for this fish [...] species too high for political reasons, and now, ten years after a complete [...] ban on fishing, the cod have not recovered.",
      "url": "http://tierramerica.info/nota.php?lang=port&idnews=185&olt=33"
    },
    {
      "id": "",
      "src": "Uma excelente escolha para quem [...] privilegia o bacalhau baixo .",
      "dst": "An excellent choice [...] for who privileges the low cod.",
      "url": "http://www.restaurantelaurentina.pt/?id=ementa"
    },
    {
      "id": "",
      "src": "Porém, dadas as diferenças biológicas [...] entre estas espécies, uma determinada [...] malhagem reterá o bacalhau melhor do que a arinca [...] e ainda melhor do que o badejo.",
      "dst": "But, because of biological differences among these species, one net [...] mesh size will retain cod better than haddock [...] and certainly better than whiting.",
      "url": "http://ec.europa.eu/fisheries/cfp/management_resources/conservation_measures/technical_measures_pt.htm"
    },
    {
      "id": "",
      "src": "Em uma travessa [...] junte as lascas de bacalhau com os demais ingredientes [...] e misture.",
      "dst": "In a bowl, add the codfish flakes with the remaining [...] ingredients and mix.",
      "url": "http://www.niasi.com.br/noticias_integra.php?n=89"
    }
  ]
}

