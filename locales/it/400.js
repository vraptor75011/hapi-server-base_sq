module.exports = {
  any: {
    allowOnly: "deve essere uno tra %{valids}",
    default: "lancia un errore mentre gira il metodo di default",
    empty: "non può essere vuoto",
    invalid: "contiene un valore invalido",
    required: "è richiesto",
    unknown: "non è permesso"
  },

  alternatives: {
    base: "non combacia con nessuna delle alternative permesse"
  },

  array: {
    base: "deve essere un array",
    includes: "alla positione %{pos} non combacia nessun tipo permesso",
    includesSingle: "singolo valore di %{key} non combacia con nessun tipo permesso",
    includesOne: "alla posizione %{pos} fallisce perché %{reason}",
    includesOneSingle: "singolo valore di %{key} fallisce perché %{reason}",
    includesRequiredUnknowns: "non contiene %{unknownMisses} valore richiesto/i",
    includesRequiredKnowns: "non contiene %{knownMisses}",
    includesRequiredBoth: "non contiene %{knownMisses} e %{unknownMisses} altri valori richiesti",
    excludes: "alla posizione %{pos} contiene un valore escluso",
    excludesSingle: "singolo valore di %{key} contiene un valore escluso",
    min: "deve contenere almeno %{limit} elementi",
    max: "deve contenere minore o uguali di %{limit} elementi",
    length: "deve contenere %{limit} elementi",
    ordered: "alla posizione %{pos} fallisce perché %{reason}",
    orderedLength: "alla posizione %{pos} fallisce perché l'array deve contenere al massimo %{limit} elementi",
    sparse: "non deve essere un array scarso",
    unique: "posizione %{pos} contiene un valore duplicato"
  },

  boolean: {
    base: "deve essere un boolean"
  },

  binary: {
    base: "deve essere una stringa o buffer",
    min: "deve essere almeno %{limit} bytes",
    max: "deve essere minore o uguale di %{limit} bytes",
    length: "deve essere %{limit} bytes"
  },

  date: {
    base: "deve essere un numero in millisecondi o una stringa con data valida",
    min: "deve essere più grande o uguale di %{limit}",
    max: "deve essere minore o uguale di %{limit}",
    isoDate: "deve essere una data valida ISO 8601",
    ref: "referenze %{ref} non è una data"
  },

  function: {
    base: "deve essere a funzione"
  },

  object: {
    base: "deve essere un oggetto",
    child: "fallisce perché %{reason}",
    min: "deve avere almeno %{limit} figli",
    max: "deve avere menore o uguale a %{limit} figli",
    length: "deve avere %{limit} figli",
    allowUnknown: "non è permesso",
    with: "manca il peer richiesto %{peer}",
    without: "conflitto con il peer proibito %{peer}",
    missing: "deve contenere almeno uno di %{peers}",
    xor: "contiene un conflitto tra peer esclusivi %{peers}",
    or: "deve contenere almeno one di %{peers}",
    and: "contiene %{present} senza il suo peer richiesto %{missing}",
    nand: "!!%{main} non deve esistere simultaneamente con %{peers}",
    assert: "!!%{ref} validazione fallita perché %{ref} fallisce in %{message}",
    rename: {
      multiple: "non si può rinominare %{from} perché rinomine multiple sono disabilitata e un'altra chiave è stata appena rinominata a %{to}",
			override: "non si può rinominare %{from} perché la sovrascrittura è disabilitata e il destinatario %{to} esiste"
		},
    type: "deve essere una istanza di %{type}"
  },

  number: {
    base: "deve essere un numero",
    min: "deve essere più grande o uguale a %{limit}",
    max: "deve essere minore o uguale a %{limit}",
    less: "deve essere minore di %{limit}",
    greater: "deve essere più grande di %{limit}",
    float: "deve essere un decimale",
    integer: "deve essere un intero",
    negative: "deve essere un numero negativo",
    positive: "deve essere a numero positivo",
    precision: "non deve avere più di %{limit} decimali",
    ref: "referenze %{ref} che non è un numero",
    multiple: "deve essere un multiplo di %{multiple}"
  },

  string: {
    base: "deve essere una string",
    min: "deve essere lunga almeno %{limit} caratteri",
    max: "deve essere lunga minore o uguale di %{limit} caratteri",
    length: "lenghezza deve essere %{limit} caratteri",
    alphanum: "deve contenere soltanto caratteri alpha-numerici",
    token: "deve contenere soltanto caratteri alpha-numeric e underscore",
    regex: {
			base: "il valore '%{value}' non rispetta il modello richiesto: %{pattern}",
			name: "il valore '%{value}' non rispetta il modello %{name}"
		},
    mail: "deve essere una email valida",
    uri: "deve essere una url valida",
    uriCustomScheme: "deve essere una uri valida con uno schema uguale al modello %{scheme}",
    isoDate: "deve essere una data valida ISO 8601",
    guid: "deve essere una valida GUID",
    hex: "deve contenere soltanto caratteri esadecimali",
    hostname: "deve essere un hostname valido",
    lowercase: "deve contenere soltanto caratteri minuscoli",
    uppercase: "deve contenere soltanto caratteri maiuscoli",
    trim: "non deve avere spazi bianchi iniziali o finali",
    creditCard: "deve essere una carta di credito",
    ref: "referenze %{ref} che non è un numero",
    ip: "deve essere indirizzo IP valido con %{cidr} CIDR",
    ipVersion: "deve essere indirizzo IP valido di una delle seguenti versioni %{version} con un %{cidr} CIDR"
  }
};