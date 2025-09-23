package Entidade.relacionamento;// ParticipaEvento.java
import jakarta.persistence.*;

@Entity
@IdClass(ParticipaEventoId.class)
public class ParticipaEvento {
    @Id
    @ManyToOne
    @JoinColumn(name = "fk_Fa_email")
    private Fa fa;

    @Id
    @ManyToOne
    @JoinColumn(name = "fk_Evento_id")
    private Evento evento;
}
