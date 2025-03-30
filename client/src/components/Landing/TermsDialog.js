import React from 'react';
import './LandingPage.css';

const TermsDialog = ({ open, onClose }) => {
  if (!open) return null;

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
        <button className="dialog-close" onClick={onClose}>×</button>
        
        <h1 className="terms-title" style={{color: '#000000'}}>TÉRMINOS Y CONDICIONES DE USO</h1>
        <div className="terms-date">Última actualización: 30 de marzo de 2025</div>
        
        <div className="terms-section">
          <h2 style={{color: '#000000'}}>1. INFORMACIÓN GENERAL Y ÁMBITO DE APLICACIÓN DEL ACUERDO</h2>
          <p className="subtitle"><strong>Documento vinculante que regula las condiciones de uso y contratación</strong></p>
          <p>1.1. Los presentes Términos y Condiciones (en adelante, "Términos") regulan el acceso y utilización de la plataforma UBoost (en adelante, "la Plataforma"), propiedad de UBoost Scientific Paper S.L., con domicilio social en Sevilla, España.</p>
          <p>1.2. El uso de la Plataforma implica la aceptación plena y sin reservas de todos y cada uno de los términos y condiciones recogidos en estos Términos, en la versión publicada en el momento en que el Usuario acceda a la Plataforma.</p>
          <p>1.3. UBoost se reserva el derecho de modificar en cualquier momento los presentes Términos. La versión actualizada estará siempre disponible en la Plataforma.</p>
        </div>

        <div className="terms-section">
          <h2 style={{color: '#000000'}}>2. DESCRIPCIÓN Y ALCANCE DE LOS SERVICIOS PROPORCIONADOS</h2>
          <p className="subtitle"><strong>Características, funcionalidades y limitaciones de la plataforma</strong></p>
          <p>2.1. UBoost es una plataforma digital orientada al ámbito académico y de investigación, que ofrece herramientas basadas en inteligencia artificial para asistir en la redacción, revisión y mejora de textos científicos.</p>
          <p>2.2. La Plataforma ofrece diferentes planes de suscripción con distintas características y funcionalidades:</p>
          
          <div className="package-description">
            <h3 style={{color: '#000000'}}>2.2.1. Plan Basic</h3>
            <p>Incluye acceso a las funcionalidades fundamentales de la Plataforma, con un número limitado de consultas mensuales y capacidades de procesamiento estándar. Está orientado a estudiantes e investigadores que comienzan su actividad académica.</p>
            
            <h3 style={{color: '#000000'}}>2.2.2. Plan Professional</h3>
            <p>Incluye todas las funcionalidades del Plan Basic, además de un mayor número de consultas mensuales, mayor capacidad de procesamiento y características avanzadas de formateo y citación. Está orientado a investigadores activos y docentes universitarios.</p>
            
            <h3 style={{color: '#000000'}}>2.2.3. Plan Enterprise</h3>
            <p>Incluye todas las funcionalidades de los planes anteriores, con consultas ilimitadas, máxima capacidad de procesamiento, soporte prioritario y herramientas especializadas para equipos de investigación. Está orientado a instituciones académicas, departamentos universitarios y centros de investigación.</p>
            
            <h3 style={{color: '#000000'}}>2.2.4. Early Access</h3>
            <p>Programa limitado para acceder a la plataforma durante su fase de desarrollo, con condiciones especiales y acceso a nuevas funcionalidades antes de su lanzamiento oficial.</p>
          </div>
        </div>

        <div className="terms-section">
          <h2 style={{color: '#000000'}}>3. MODALIDADES DE PAGO Y PROCESAMIENTO DE TRANSACCIONES</h2>
          <p className="subtitle"><strong>Condiciones económicas, plataforma de pago y gestión de la facturación</strong></p>
          <p>3.1. UBoost utiliza STRIPE como plataforma de procesamiento de pagos para todas las transacciones realizadas en la Plataforma.</p>
          <p>3.2. Al realizar un pago en la Plataforma, el Usuario acepta los términos y condiciones de STRIPE, disponibles en su página web oficial.</p>
          <p>3.3. UBoost no almacena información de tarjetas de crédito ni datos bancarios de los Usuarios, siendo esta información gestionada directamente por STRIPE bajo sus propios protocolos de seguridad.</p>
          <p>3.4. Los precios indicados en la Plataforma incluyen los impuestos aplicables según la legislación vigente en el territorio español. Para usuarios de otros países, podrían aplicarse impuestos adicionales según la legislación local.</p>
          <p>3.5. Las suscripciones se renuevan automáticamente al finalizar el periodo contratado, salvo que el Usuario comunique su intención de no renovar con al menos 7 días de antelación a la fecha de renovación.</p>
        </div>

        <div className="terms-section">
          <h2 style={{color: '#000000'}}>4. POLÍTICA DE DEVOLUCIONES Y CANCELACIÓN DEL SERVICIO</h2>
          <p className="subtitle"><strong>Condiciones y procedimientos aplicables a reembolsos y cancelaciones</strong></p>
          <p>4.1. <strong>NO SE ADMITEN DEVOLUCIONES</strong> una vez activada la suscripción o consumido cualquier servicio en la Plataforma.</p>
          <p>4.2. El Usuario reconoce y acepta que, debido a la naturaleza digital e inmaterial de los servicios ofrecidos, estos no son susceptibles de devolución una vez han sido proporcionados.</p>
          <p>4.3. En casos excepcionales de mal funcionamiento prolongado y grave de la Plataforma, UBoost podrá, a su exclusiva discreción, ofrecer compensaciones en forma de créditos o extensiones de servicio, sin que en ningún caso proceda la devolución económica.</p>
          <p>4.4. La cancelación de una suscripción no da derecho a la devolución de las cantidades ya abonadas correspondientes al periodo contratado, pudiendo el Usuario seguir utilizando el servicio hasta la finalización de dicho periodo.</p>
        </div>

        <div className="terms-section">
          <h2 style={{color: '#000000'}}>5. RESPONSABILIDADES Y OBLIGACIONES CONTRACTUALES DEL USUARIO</h2>
          <p className="subtitle"><strong>Conductas permitidas, prohibidas y consecuencias de su incumplimiento</strong></p>
          <p>5.1. El Usuario se compromete a hacer un uso lícito, ético y adecuado de la Plataforma, en conformidad con la legislación vigente, los presentes Términos y la moral y buenas costumbres generalmente aceptadas.</p>
          <p>5.2. El Usuario es el único responsable de la veracidad y exactitud de los datos proporcionados para el registro en la Plataforma.</p>
          <p>5.3. Queda expresamente prohibido utilizar la Plataforma para:</p>
          <ul className="terms-list">
            <li>Actividades que violen derechos de propiedad intelectual o industrial.</li>
            <li>Generación de contenido falso, engañoso o fraudulento.</li>
            <li>Cualquier actividad que pueda ser considerada como plagio académico.</li>
            <li>Difundir contenido ilícito o que atente contra derechos de terceros.</li>
            <li>Realizar ingeniería inversa o intentar acceder al código fuente de la Plataforma.</li>
          </ul>
          <p>5.4. El Usuario reconoce y acepta que el contenido generado mediante la Plataforma debe ser revisado y, en su caso, modificado antes de su uso o publicación, siendo el Usuario el único responsable del contenido final.</p>
        </div>

        <div className="terms-section">
          <h2 style={{color: '#000000'}}>6. PROPIEDAD INTELECTUAL E INDUSTRIAL Y DERECHOS DE AUTOR</h2>
          <p className="subtitle"><strong>Titularidad de los derechos y licencias de uso concedidas</strong></p>
          <p>6.1. Todos los derechos de propiedad intelectual e industrial sobre la Plataforma, sus contenidos, código fuente, diseño, estructura de navegación, bases de datos y elementos que la integran son titularidad de UBoost o de sus licenciantes.</p>
          <p>6.2. Queda expresamente prohibida la reproducción, distribución, comunicación pública, transformación o cualquier otra forma de explotación, total o parcial, de los contenidos de la Plataforma sin la autorización expresa de UBoost.</p>
          <p>6.3. El Usuario conserva todos los derechos de propiedad intelectual sobre el contenido que genere utilizando la Plataforma, sin perjuicio de las licencias necesarias para el correcto funcionamiento del servicio.</p>
        </div>

        <div className="terms-section">
          <h2 style={{color: '#000000'}}>7. PROTECCIÓN DE DATOS PERSONALES Y POLÍTICA DE PRIVACIDAD</h2>
          <p className="subtitle"><strong>Tratamiento de la información personal conforme al RGPD</strong></p>
          <p>7.1. UBoost cumple con la normativa vigente en materia de protección de datos personales, incluyendo el Reglamento General de Protección de Datos (RGPD) de la Unión Europea.</p>
          <p>7.2. Los datos personales que el Usuario proporcione serán tratados conforme a lo establecido en la Política de Privacidad de la Plataforma, que el Usuario declara conocer y aceptar.</p>
        </div>

        <div className="terms-section">
          <h2 style={{color: '#000000'}}>8. LIMITACIÓN Y EXONERACIÓN DE RESPONSABILIDAD LEGAL</h2>
          <p className="subtitle"><strong>Alcance y límites de la responsabilidad de la plataforma</strong></p>
          <p>8.1. UBoost no garantiza la disponibilidad y continuidad del funcionamiento de la Plataforma. En ningún caso UBoost será responsable por los daños y perjuicios de cualquier naturaleza que puedan deberse a la falta de disponibilidad o de continuidad del funcionamiento de la Plataforma.</p>
          <p>8.2. UBoost no garantiza la utilidad de la Plataforma para la realización de ninguna actividad en particular, ni su infalibilidad.</p>
          <p>8.3. UBoost no será responsable por los daños y perjuicios de toda naturaleza que pudieran derivarse del uso de la Plataforma por parte del Usuario o de terceros.</p>
        </div>

        <div className="terms-section">
          <h2 style={{color: '#000000'}}>9. LEY APLICABLE, JURISDICCIÓN COMPETENTE Y RESOLUCIÓN DE CONTROVERSIAS</h2>
          <p className="subtitle"><strong>Marco jurídico aplicable y tribunales competentes</strong></p>
          <p>9.1. Los presentes Términos se rigen por la legislación española.</p>
          <p>9.2. Para la resolución de cualquier controversia que pudiera derivarse del acceso o uso de la Plataforma, las partes acuerdan someterse expresamente a los Juzgados y Tribunales de la ciudad de Sevilla, España, con renuncia expresa a cualquier otro fuero que pudiera corresponderles.</p>
          <p>9.3. Toda reclamación o procedimiento legal relacionado con la Plataforma deberá iniciarse dentro del plazo de un (1) año a partir de que surgiera la causa de la acción, o en el plazo máximo permitido por la ley aplicable si este fuera menor.</p>
        </div>

        <div className="terms-section">
          <h2 style={{color: '#000000'}}>10. DISPOSICIONES FINALES Y MODIFICACIONES DEL CONTRATO</h2>
          <p className="subtitle"><strong>Nulidad parcial, renuncia de derechos y actualizaciones de términos</strong></p>
          <p>10.1. Si cualquier cláusula incluida en estos Términos fuese declarada total o parcialmente nula o ineficaz, tal nulidad o ineficacia afectará tan sólo a dicha disposición o a la parte de la misma que resulte nula o ineficaz, subsistiendo los Términos en todo lo demás.</p>
          <p>10.2. La no exigencia por parte de UBoost del cumplimiento estricto de alguno de los términos de estas condiciones, no constituye ni podrá interpretarse en ningún caso como una renuncia por su parte a exigir su cumplimiento en el futuro.</p>
          <p>10.3. El Usuario reconoce haber leído los presentes Términos en su totalidad, comprendiéndolos y aceptándolos en su integridad.</p>
        </div>

        <div className="terms-seal">
          <p>© 2025 UBoost Scientific Paper S.L. - Todos los derechos reservados</p>
        </div>
      </div>
    </div>
  );
};

export default TermsDialog;
