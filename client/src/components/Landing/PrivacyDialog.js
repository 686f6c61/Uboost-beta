import React from 'react';
import './LandingPage.css';

const PrivacyDialog = ({ open, onClose }) => {
  if (!open) return null;

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
        <button className="dialog-close" onClick={onClose}>×</button>
        
        <h1 className="terms-title" style={{color: '#000000'}}>POLÍTICA DE PRIVACIDAD</h1>
        <div className="terms-date">Última actualización: 30 de marzo de 2025</div>
        
        <div className="terms-section">
          <h2 style={{color: '#000000'}}>1. RESPONSABLE DEL TRATAMIENTO DE DATOS PERSONALES</h2>
          <p className="subtitle"><strong>Identificación de la entidad que determina los fines y medios del tratamiento</strong></p>
          <p><strong>Identidad:</strong> UBoost Scientific Paper S.L. (en adelante, "UBoost")</p>
          <p><strong>Dirección postal:</strong> Sevilla, España</p>
          <p><strong>Correo electrónico:</strong> privacy@uboost.edu</p>
          <p><strong>Delegado de Protección de Datos (DPD):</strong> dpd@uboost.edu</p>
        </div>

        <div className="terms-section">
          <h2 style={{color: '#000000'}}>2. FINALIDADES DEL TRATAMIENTO DE DATOS PERSONALES</h2>
          <p className="subtitle"><strong>Propósitos específicos para los cuales se recaban y procesan los datos</strong></p>
          <p>En UBoost tratamos los datos personales que nos facilite con las siguientes finalidades:</p>
          <ul className="terms-list">
            <li>Gestionar el registro y la cuenta de usuario en nuestra plataforma.</li>
            <li>Proporcionar, personalizar y mejorar nuestros servicios.</li>
            <li>Procesar pagos y gestionar suscripciones.</li>
            <li>Enviar comunicaciones relacionadas con el servicio.</li>
            <li>Gestionar solicitudes, consultas o reclamaciones.</li>
            <li>Enviar comunicaciones comerciales sobre nuestros productos y servicios, siempre que haya consentido expresamente.</li>
            <li>Cumplir con nuestras obligaciones legales.</li>
            <li>Gestionar el programa de Early Access.</li>
          </ul>
        </div>

        <div className="terms-section">
          <h2 style={{color: '#000000'}}>3. LEGITIMACIÓN JURÍDICA PARA EL TRATAMIENTO DE DATOS</h2>
          <p className="subtitle"><strong>Bases legales que amparan la recogida y procesamiento de información personal</strong></p>
          <p>La base legal para el tratamiento de sus datos es:</p>
          <ul className="terms-list">
            <li><strong>Ejecución de un contrato:</strong> El tratamiento es necesario para la ejecución del contrato de prestación de servicios al que usted es parte o para la aplicación de medidas precontractuales.</li>
            <li><strong>Consentimiento:</strong> El tratamiento se basa en el consentimiento que usted nos otorga al aceptar nuestra Política de Privacidad y marcar las casillas correspondientes en nuestros formularios.</li>
            <li><strong>Interés legítimo:</strong> En determinados casos, el tratamiento puede basarse en el interés legítimo de UBoost, como el envío de comunicaciones a usuarios existentes sobre servicios similares.</li>
            <li><strong>Obligación legal:</strong> En algunos casos, el tratamiento puede ser necesario para cumplir con una obligación legal aplicable a UBoost.</li>
          </ul>
        </div>

        <div className="terms-section">
          <h2 style={{color: '#000000'}}>4. CATEGORÍAS Y TIPOLOGÍA DE DATOS PERSONALES TRATADOS</h2>
          <p className="subtitle"><strong>Clasificación de la información personal objeto de tratamiento</strong></p>
          <p>Las categorías de datos que tratamos son:</p>
          <ul className="terms-list">
            <li><strong>Datos identificativos:</strong> nombre, apellidos, correo electrónico.</li>
            <li><strong>Datos académicos:</strong> universidad o institución, área de investigación.</li>
            <li><strong>Datos de uso:</strong> información sobre cómo utiliza nuestra plataforma.</li>
            <li><strong>Datos de facturación:</strong> necesarios para procesar pagos (gestionados a través de STRIPE).</li>
            <li><strong>Datos de contenido:</strong> información que usted proporciona al utilizar nuestros servicios, como consultas o textos para análisis.</li>
          </ul>
        </div>

        <div className="terms-section">
          <h2 style={{color: '#000000'}}>5. CONSERVACIÓN Y PLAZOS DE RETENCIÓN DE DATOS PERSONALES</h2>
          <p className="subtitle"><strong>Períodos de almacenamiento y criterios de eliminación de la información</strong></p>
          <p>Conservaremos sus datos personales durante el tiempo necesario para cumplir con las finalidades para las que fueron recabados, incluyendo la satisfacción de cualquier requisito legal, contable o de información.</p>
          <p>En particular:</p>
          <ul className="terms-list">
            <li>Los datos relacionados con su cuenta de usuario se conservarán mientras mantenga su relación con UBoost y no solicite su supresión.</li>
            <li>Los datos de facturación se conservarán durante el tiempo exigido por la legislación fiscal (generalmente, 6 años).</li>
            <li>Los datos relacionados con comunicaciones comerciales se conservarán hasta que retire su consentimiento.</li>
          </ul>
          <p>Una vez finalizada la relación, sus datos serán bloqueados durante el tiempo requerido por la legislación aplicable, quedando a disposición exclusiva de las autoridades competentes, y únicamente para la atención de posibles responsabilidades nacidas del tratamiento.</p>
        </div>

        <div className="terms-section">
          <h2 style={{color: '#000000'}}>6. DESTINATARIOS Y COMUNICACIONES DE DATOS PERSONALES</h2>
          <p className="subtitle"><strong>Entidades y terceros que pueden acceder a la información proporcionada</strong></p>
          <p>Sus datos personales podrán ser comunicados a:</p>
          <ul className="terms-list">
            <li><strong>Proveedores de servicios</strong> que actúan como encargados de tratamiento y que necesitan acceder a sus datos para prestarnos servicios, como servicios de alojamiento, pagos (STRIPE), envío de comunicaciones, etc.</li>
            <li><strong>Autoridades competentes</strong>, cuando así lo exija la normativa aplicable.</li>
          </ul>
          <p>UBoost garantiza que todas las comunicaciones de datos se realizan con las garantías adecuadas de acuerdo con la normativa de protección de datos.</p>
        </div>

        <div className="terms-section">
          <h2 style={{color: '#000000'}}>7. TRANSFERENCIAS INTERNACIONALES DE DATOS PERSONALES</h2>
          <p className="subtitle"><strong>Movimientos transfronterizos de datos y garantías aplicables</strong></p>
          <p>Para la prestación de nuestros servicios, podemos utilizar proveedores ubicados fuera del Espacio Económico Europeo (EEE). En estos casos, UBoost garantiza que dichas transferencias se realizan:</p>
          <ul className="terms-list">
            <li>A países, territorios o sectores que la Comisión Europea haya declarado que garantizan un nivel de protección adecuado.</li>
            <li>Mediante la adopción de garantías adecuadas como cláusulas contractuales tipo aprobadas por la Comisión Europea.</li>
            <li>Al amparo de normas corporativas vinculantes, el Escudo de Privacidad UE-EE.UU. o cualquier otro mecanismo válido según la normativa aplicable.</li>
          </ul>
          <p>Puede solicitar más información sobre estas transferencias y las garantías aplicables a través de nuestro Delegado de Protección de Datos.</p>
        </div>

        <div className="terms-section">
          <h2 style={{color: '#000000'}}>8. DERECHOS DE LOS INTERESADOS Y PROCEDIMIENTO DE EJERCICIO</h2>
          <p className="subtitle"><strong>Facultades reconocidas por el RGPD y mecanismos para su aplicación efectiva</strong></p>
          <p>Usted puede ejercer los siguientes derechos en relación con el tratamiento de sus datos personales:</p>
          <ul className="terms-list">
            <li><strong>Acceso:</strong> Conocer qué datos personales tratamos sobre usted.</li>
            <li><strong>Rectificación:</strong> Modificar los datos inexactos o incompletos.</li>
            <li><strong>Supresión:</strong> Solicitar la eliminación de sus datos cuando ya no sean necesarios, entre otros supuestos.</li>
            <li><strong>Oposición:</strong> Solicitar que dejemos de tratar sus datos por motivos relacionados con su situación particular.</li>
            <li><strong>Limitación del tratamiento:</strong> Solicitar la restricción del tratamiento de sus datos en determinados supuestos.</li>
            <li><strong>Portabilidad:</strong> Recibir los datos que nos ha facilitado en un formato estructurado, de uso común y lectura mecánica, y a transmitirlos a otro responsable.</li>
            <li><strong>Retirar el consentimiento:</strong> Revocar en cualquier momento los consentimientos previamente otorgados.</li>
          </ul>
          <p>Puede ejercer estos derechos enviando un correo electrónico a privacy@uboost.edu o una carta a nuestra dirección postal, adjuntando copia de su DNI o documento identificativo equivalente.</p>
          <p>También tiene derecho a presentar una reclamación ante la Agencia Española de Protección de Datos (www.aepd.es) si considera que el tratamiento no se ajusta a la normativa vigente.</p>
        </div>

        <div className="terms-section">
          <h2 style={{color: '#000000'}}>9. MEDIDAS DE SEGURIDAD TÉCNICAS Y ORGANIZATIVAS</h2>
          <p className="subtitle"><strong>Salvaguardas implementadas para la protección de datos personales</strong></p>
          <p>UBoost ha implementado medidas técnicas y organizativas apropiadas para garantizar un nivel de seguridad adecuado al riesgo, teniendo en cuenta el estado de la técnica, los costes de aplicación, la naturaleza, el alcance, el contexto y los fines del tratamiento, así como los riesgos para los derechos y libertades de las personas físicas.</p>
          <p>Estas medidas incluyen, entre otras:</p>
          <ul className="terms-list">
            <li>Cifrado de datos personales cuando sea apropiado.</li>
            <li>Capacidad de garantizar la confidencialidad, integridad, disponibilidad y resiliencia permanentes de los sistemas y servicios de tratamiento.</li>
            <li>Capacidad de restaurar la disponibilidad y el acceso a los datos personales de forma rápida en caso de incidente físico o técnico.</li>
            <li>Proceso de verificación, evaluación y valoración regulares de la eficacia de las medidas técnicas y organizativas para garantizar la seguridad del tratamiento.</li>
          </ul>
        </div>

        <div className="terms-section">
          <h2 style={{color: '#000000'}}>10. MODIFICACIONES Y ACTUALIZACIONES DE LA POLÍTICA DE PRIVACIDAD</h2>
          <p className="subtitle"><strong>Procedimiento de revisión y comunicación de cambios en el documento</strong></p>
          <p>UBoost se reserva el derecho de modificar esta Política de Privacidad para adaptarla a novedades legislativas, doctrinales o interpretativas de las autoridades competentes. En tales casos, UBoost anunciará en esta página los cambios introducidos con razonable antelación a su puesta en práctica.</p>
          <p>La utilización de nuestros servicios después de la publicación de estos cambios implicará la aceptación de los mismos.</p>
        </div>

        <div className="terms-seal">
          <p>© 2025 UBoost Scientific Paper S.L. - Todos los derechos reservados</p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyDialog;
